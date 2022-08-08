import {InvalidParameterException, NotImplementedException} from "../../exceptions";
import {JSONObject} from "@elastosfoundation/did-js-sdk";
import {Logger} from "../..";
import * as sodium from 'libsodium-wrappers';

/**
 * Json types: object(dict), string, number, boolean, null, array.
 */
class EncryptedJsonValue {
    private static LOG = new Logger("DatabaseEncrypt");

    private static readonly TYPE_STRING = 2;
    private static readonly TYPE_BOOLEAN = 8;
    private static readonly TYPE_NUMBER = 16;
    private static readonly TYPE_OTHER = -1; // can not be encrypted

    private readonly secretKey: Uint8Array;
    private readonly value: any;
    private readonly isEncrypt: boolean;

    constructor(value: any, isEncrypt: boolean) {
        // TODO: get the secret key from current DID document.
        this.secretKey = sodium.from_hex('724b092810ec86d7e35c9d067702b31ef90bc43a7b598626749914d6a3e033ed');
        this.value = value;
        this.isEncrypt = isEncrypt;
    }

    isBasicType() {
        const type = typeof this.value;
        return type === 'number' || type == 'boolean' || type == 'string';
    }

    getOriginalType() {
        return typeof this.value;
    }

    getDecryptedValue(type) {
        if (type == EncryptedJsonValue.TYPE_OTHER) {
            EncryptedJsonValue.LOG.info('Should not decrypt an unsupported type value');
            return this.value;
        }

        if (this.value.length < sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES) {
            throw new InvalidParameterException('Invalid document value, please make sure it is encrypted');
        }
        let nonce = this.value.slice(0, sodium.crypto_secretbox_NONCEBYTES),
            ciphertext = this.value.slice(sodium.crypto_secretbox_NONCEBYTES);
        const originalValue = sodium.crypto_secretbox_open_easy(ciphertext, nonce, this.secretKey, 'text');

        switch (this.getOriginalType()) {
            case "string":
                return originalValue;
            case "boolean":
                return originalValue === 'true';
            case "number":
                return Number(originalValue);
        }

        return originalValue;
    }

    getEncryptData() {
        if (!this.isBasicType()) {
            return this.value;
        }

        if (this.isEncrypt) {
            const strVal = this.value.toString();

            let nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
            return new Uint8Array([...nonce, ...sodium.crypto_secretbox_easy(strVal, nonce, this.secretKey)]);
        } else {

        }
    }

    getType(): number {
        switch (this.getOriginalType()) {
            case "string":
                return EncryptedJsonValue.TYPE_STRING;
            case "boolean":
                return EncryptedJsonValue.TYPE_BOOLEAN;
            case "number":
                return EncryptedJsonValue.TYPE_NUMBER;
        }
        return EncryptedJsonValue.TYPE_OTHER;
    }

    encryptDoc() {
        const encryptRecursive = (value) => {
            if (value === undefined || value === null) {
                return null;
            }

            if (value.constructor == Object) { // dictionary
                if (!this.isEncrypt && '__binary__' in value && '__type__' in value) { // need decrypt to plaintext
                    return new EncryptedJsonValue(value['__binary__'], false).getDecryptedValue(value['__type__']);
                }

                for (const [k, v] of Object.entries(value)) {
                    value[k] = encryptRecursive(v);
                }
                return value;
            }

            if (Array.isArray(value)) { // array
                let retVal = [];
                for (const v of value) {
                    retVal.push(encryptRecursive(v));
                }
                return retVal;
            }

            const enval = new EncryptedJsonValue(value, this.isEncrypt);
            if (!enval.isBasicType()) {
                EncryptedJsonValue.LOG.info(`The value should be basic type, but ${enval.getOriginalType()}`);
                return value;
            }

            return {
                '__binary__': enval.getEncryptData(),
                '__type__': enval.getType(),
            }
        };

        let retVal = encryptRecursive(this.value);
        retVal['__encrypt__'] = 'user_did'; // record encrypt way
        return retVal;
    }

    encryptFilter() {
        const value = this.value;
        if (value === undefined || value === null) {
            return null;
        }

        if (value.constructor != Object) {
            EncryptedJsonValue.LOG.info(`Unexpected filter type ${typeof value}.`);
            return value;
        }

        let result = {};
        const isReservedKey = (v) => v.startsWith('$');

        for (const [k, v] of Object.entries(value)) {
            const enval = new EncryptedJsonValue(v, this.isEncrypt);
            if (!isReservedKey(k) && enval.isBasicType()) { // query field with value.
                result[`${k}.__binary__`] = enval.getEncryptData();
                result[`${k}.__type__`] = enval.getType();
            } else {
                result[k] = v;
            }
        }

        return result;
    }

    encryptUpdate() {
        const value = this.value;
        if (value === undefined || value === null) {
            return null;
        }

        if ('$set' in value && !!value['$set'] && value['$set'].constructor == Object) {
            value['$set'] = new EncryptedJsonValue(value['$set'], this.isEncrypt).encryptDoc();
        }

        if ('$setOnInsert' in value && !!value['$setOnInsert'] && value['$setOnInsert'].constructor == Object) {
            value['$setOnInsert'] = new EncryptedJsonValue(value['$setOnInsert'], this.isEncrypt).encryptDoc();
        }

        return value;
    }
}

export class DatabaseEncrypt {
    /**
     * Encrypt the document fields when insert.
     *
     * @param doc
     * @param isEncrypt
     */
    encryptDoc(doc: any, isEncrypt=true) {
        const json = DatabaseEncrypt.getGeneralJsonDict(doc, 'The document must be dictionary.');
        if (Object.keys(json).length == 0) {
            return {};
        }

        return new EncryptedJsonValue(json, isEncrypt).encryptDoc();
    }

    /**
     * Encrypt the fields of documents when insert.
     *
     * @param docs
     * @param isEncrypt
     */
    encryptDocs(docs: any[], isEncrypt=true) {
        let resDocs = [];
        for (const doc of docs) {
            resDocs.push(this.encryptDoc(doc, isEncrypt));
        }
        return resDocs;
    }

    /**
     * Encrypt the fields of the filter when find, count, etc.
     *
     * Just support simply query (with the vault of the fields).
     *
     * @param filter
     * @param isEncrypt
     */
    encryptFilter(filter: JSONObject) {
        const json = DatabaseEncrypt.getGeneralJsonDict(filter, 'The filter must be dictionary.');
        if (Object.keys(json).length == 0) {
            return {};
        }

        return new EncryptedJsonValue(json, true).encryptFilter();
    }

    /**
     * Encrypt the fields of the update.
     *
     * Just support simply query (with the vault of the fields).
     *
     * @param update
     * @param isEncrypt
     */
    encryptUpdate(update: JSONObject) {
        const json = DatabaseEncrypt.getGeneralJsonDict(update, 'The update must be dictionary.');
        if (Object.keys(json).length == 0) {
            return {};
        }

        return new EncryptedJsonValue(json, true).encryptUpdate();
    }

    private static getGeneralJsonDict(map: any, message: string) {
        const str = JSON.stringify(map);
        const json = JSON.parse(str);
        if (json.constructor != Object) { // not dictionary
            throw new InvalidParameterException(message);
        }

        if (Object.keys(json).length == 0) {
            return {};
        }
    }
}
