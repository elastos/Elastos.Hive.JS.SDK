import {InvalidParameterException, NotImplementedException} from "../../exceptions";
import {JSONObject} from "@elastosfoundation/did-js-sdk";
import {Logger} from "../../utils/logger";
// import * as sodium from 'libsodium-wrappers';

const sodium = require('libsodium-wrappers'); // TODO:

/**
 * Json types: object(dict), string, number, boolean, null, array.
 */
export class EncryptedJsonValue {
    private static LOG = new Logger("DatabaseEncryption");

    public static readonly TYPE_STRING = 2;
    private static readonly TYPE_BOOLEAN = 8;
    private static readonly TYPE_NUMBER = 16;
    private static readonly TYPE_OTHER = -1; // can not be encrypted

    private readonly secretKey: Uint8Array;
    private readonly nonce: Uint8Array;
    private readonly value: any;
    private readonly isEncrypt: boolean;

    constructor(value: any, isEncrypt: boolean) {
        // TODO: get the secret key from current DID document.
        this.secretKey = sodium.from_hex('724b092810ec86d7e35c9d067702b31ef90bc43a7b598626749914d6a3e033ed');

        // fixed nonce value.
        let nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
        for (let i = 0; i < nonce.length; i++) {
            nonce[i] = 123;
        }
        this.nonce = nonce;

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

        const arrData = Uint8Array.from(Buffer.from(this.value, "hex"))
        if (arrData.length < sodium.crypto_secretbox_NONCEBYTES) {
            throw new InvalidParameterException('Invalid document value, please make sure it is encrypted');
        }

        let nonce = arrData.slice(0, sodium.crypto_secretbox_NONCEBYTES),
            ciphertext = arrData.slice(sodium.crypto_secretbox_NONCEBYTES);
        const originalValue = sodium.crypto_secretbox_open_easy(ciphertext, this.nonce, this.secretKey, 'text');

        switch (type) {
            case EncryptedJsonValue.TYPE_STRING:
                return originalValue;
            case EncryptedJsonValue.TYPE_BOOLEAN:
                return originalValue === 'true';
            case EncryptedJsonValue.TYPE_NUMBER:
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
            const arrData = new Uint8Array([...this.nonce, ...sodium.crypto_secretbox_easy(strVal, this.nonce, this.secretKey)]);
            return Buffer.from(arrData).toString("hex");
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

                let retVal = {};
                for (const [k, v] of Object.entries(value)) {
                    retVal[k] = encryptRecursive(v);
                }
                return retVal;
            }

            if (Array.isArray(value)) { // array
                let retVal = [];
                for (const v of value) {
                    retVal.push(encryptRecursive(v));
                }
                return retVal;
            }

            if (this.isEncrypt) {
                const enval = new EncryptedJsonValue(value, this.isEncrypt);
                if (!enval.isBasicType()) {
                    EncryptedJsonValue.LOG.info(`The value should be basic type, but ${enval.getOriginalType()}`);
                    return value;
                }

                return {
                    '__binary__': enval.getEncryptData(),
                    '__type__': enval.getType(),
                }
            }

            return value;
        };

        if (!this.isEncrypt && '__encrypt__' in this.value) {
            delete this.value['__encrypt__'];
            let retVal = encryptRecursive(this.value);
            return JSON.parse(JSON.stringify(retVal)); // JSONObject
        }

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

export class DatabaseEncryption {
    /**
     * Encrypt the document fields when insert.
     *
     * @param doc
     * @param isEncrypt
     */
    encryptDoc(doc: any, isEncrypt=true) {
        const json = DatabaseEncryption.getGeneralJsonDict(doc, 'The document must be dictionary.');
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
        const json = DatabaseEncryption.getGeneralJsonDict(filter, 'The filter must be dictionary.');
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
        const json = DatabaseEncryption.getGeneralJsonDict(update, 'The update must be dictionary.');
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
        return json;
    }

    encryptFileContent(content: Buffer | string) {
        let data = content instanceof Buffer ? content.toString('utf8') : content;
        return new EncryptedJsonValue(data, true).getEncryptData();
    }

    decryptFileContent(content: Buffer) {
        return new EncryptedJsonValue(content.toString('utf8'), false).getDecryptedValue(EncryptedJsonValue.TYPE_STRING);
    }
}
