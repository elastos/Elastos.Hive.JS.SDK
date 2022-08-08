import {InvalidParameterException, NotImplementedException} from "../../exceptions";
import {JSONObject} from "@elastosfoundation/did-js-sdk";
import {Logger} from "../..";
import * as sodium from 'libsodium-wrappers';

/**
 * Json types: object(dict), string, number, boolean, null, array.
 */
class EncryptJsonValue {
    private static LOG = new Logger("DatabaseEncrypt");

    private static readonly TYPE_STRING = 2;
    private static readonly TYPE_BOOLEAN = 8;
    private static readonly TYPE_NUMBER = 16;
    private static readonly TYPE_OTHER = -1; // can not be encrypted

    private readonly secretKey: Uint8Array;
    private readonly value: any;

    constructor(value: any) {
        this.value = value;
        // TODO: get the secret key from current DID document.
        this.secretKey = sodium.from_hex('724b092810ec86d7e35c9d067702b31ef90bc43a7b598626749914d6a3e033ed');
    }

    isBasicType() {
        const type = typeof this.value;
        return type === 'number' || type == 'boolean' || type == 'string';
    }

    getOriginalType() {
        return typeof this.value;
    }

    getEncryptData() {
        if (!this.isBasicType()) {
            return this.value;
        }

        const strVal = this.value.toString();

        let nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
        return new Uint8Array([...nonce, ...sodium.crypto_secretbox_easy(strVal, nonce, this.secretKey)]);
    }

    getType(): number {
        switch (this.getOriginalType()) {
            case "string":
                return EncryptJsonValue.TYPE_STRING;
            case "boolean":
                return EncryptJsonValue.TYPE_BOOLEAN;
            case "number":
                return EncryptJsonValue.TYPE_NUMBER;
        }
        return EncryptJsonValue.TYPE_OTHER;
    }

    encryptDoc() {
        const encryptRecursive = (value) => {
            if (value === undefined || value === null) {
                return null;
            }

            if (value.constructor == Object) { // dictionary
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

            const enval = new EncryptJsonValue(value);
            if (!enval.isBasicType()) {
                EncryptJsonValue.LOG.info(`The value should be basic type, but ${enval.getOriginalType()}`);
                return value;
            }

            return {
                '__binary__': enval.getEncryptData(),
                '__type__': enval.getType(),
            }
        };

        return encryptRecursive(this.value);
    }

    encryptFilter() {
        const value = this.value;
        if (value === undefined || value === null) {
            return null;
        }

        if (value.constructor != Object) {
            EncryptJsonValue.LOG.info(`Unexpected filter type ${typeof value}.`);
            return value;
        }

        let result = {};
        const isReservedKey = (v) => v.startsWith('$');

        for (const [k, v] of Object.entries(value)) {
            const enval = new EncryptJsonValue(v);
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
            value['$set'] = new EncryptJsonValue(value['$set']).encryptDoc();
        }

        if ('$setOnInsert' in value && !!value['$setOnInsert'] && value['$setOnInsert'].constructor == Object) {
            value['$setOnInsert'] = new EncryptJsonValue(value['$setOnInsert']).encryptDoc();
        }

        return value;
    }
}

export class DatabaseEncrypt {
    /**
     * Encrypt the document fields when insert.
     *
     * @param doc
     */
    encryptDoc(doc: any) {
        const str = JSON.stringify(doc);
        const jsonDict = JSON.parse(str);
        if (jsonDict.constructor != Object) { // not dictionary
            throw new InvalidParameterException('The document must be dictionary.');
        }

        return new EncryptJsonValue(jsonDict).encryptDoc();
    }

    /**
     * Encrypt the fields of documents when insert.
     *
     * @param docs
     */
    encryptDocs(docs: any[]) {
        let resDocs = [];
        for (const doc of docs) {
            resDocs.push(this.encryptDoc(doc));
        }
        return resDocs;
    }

    /**
     * Encrypt the fields of the filter when find, count, etc.
     *
     * Just support simply query (with the vault of the fields).
     *
     * @param filter
     */
    encryptFilter(filter: JSONObject) {
        const str = JSON.stringify(filter);
        const json = JSON.parse(str);
        if (json.constructor != Object) { // not dictionary
            throw new InvalidParameterException('The document must be dictionary.');
        }

        return new EncryptJsonValue(json).encryptFilter();
    }

    /**
     * Encrypt the fields of the update.
     *
     * Just support simply query (with the vault of the fields).
     *
     * @param update
     */
    encryptUpdate(update: JSONObject) {
        const str = JSON.stringify(update);
        const json = JSON.parse(str);
        if (json.constructor != Object) { // not dictionary
            throw new InvalidParameterException('The document must be dictionary.');
        }

        return new EncryptJsonValue(json).encryptUpdate();
    }
}
