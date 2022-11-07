import {Cipher, JSONObject} from "@elastosfoundation/did-js-sdk";
import {InvalidParameterException, NotImplementedException} from "../../exceptions";
import {BasicEncryptionValue, EncryptionValue} from "../../utils/encryption/encryptionvalue";
import {Logger} from "../../utils/logger";

export class EncryptionDocument extends EncryptionValue {
    constructor(cipher: Cipher, private nonce: Buffer, value: any) {
        super(cipher, value);
    }

    encrypt() {
        const encryptRecursive = (value) => {
            if (value === undefined || value === null) {
                return null;
            }

            if (value.constructor == Object) { // dictionary
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

            const val = new BasicEncryptionValue(this.cipher, this.nonce, value);
            return {
                '__binary__': val.encrypt(),
                '__type__': val.getEncryptedType(),
            }
        };

        if (!this.value || this.value.constructor !== Object) {
            throw new InvalidParameterException(`Invalid dictionary ${JSON.stringify(this.value)}(${typeof this.value})`);
        }

        return encryptRecursive(this.value);
    }

    decrypt() {
        const decryptRecursive = (value) => {
            if (value === undefined || value === null) {
                return null;
            }

            if (value.constructor == Object) { // dictionary
                if ('__binary__' in value && '__type__' in value) { // need decrypt to plaintext
                    return new BasicEncryptionValue(this.cipher, this.nonce, value['__binary__'], value['__type__']).decrypt();
                }

                let retVal = {};
                for (const [k, v] of Object.entries(value)) {
                    retVal[k] = decryptRecursive(v);
                }
                return retVal;
            }

            if (Array.isArray(value)) { // array
                let retVal = [];
                for (const v of value) {
                    retVal.push(decryptRecursive(v));
                }
                return retVal;
            }

            return value;
        };

        let retVal = decryptRecursive(this.value);
        return JSON.parse(JSON.stringify(retVal)); // JSONObject
    }

}

export class EncryptionFilter extends EncryptionValue {
    private static LOG = new Logger("EncryptionFilter");

    constructor(cipher: Cipher, private nonce: Buffer, value: any) {
        super(cipher, value);
    }

    encrypt() {
        const value = this.value;
        if (value === undefined || value === null) {
            return null;
        }

        if (value.constructor != Object) { // not a dictionary.
            EncryptionFilter.LOG.info(`Unexpected filter type ${typeof value}.`);
            return value;
        }

        let result = {};

        for (const [k, v] of Object.entries(value)) {
            const enval = new BasicEncryptionValue(this.cipher, this.nonce, v);
            if (enval.isBasicType()) { // query field with value.
                result[`${k}.__binary__`] = enval.encrypt();
                result[`${k}.__type__`] = enval.getEncryptedType();
            } else {
                result[k] = v;
            }
        }

        return result;
    }

    decrypt() {
        throw new NotImplementedException();
    }
}

export class EncryptionUpdate extends EncryptionValue {
    constructor(cipher: Cipher, private nonce: Buffer, value: any) {
        super(cipher, value);
    }

    encrypt() {
        const value = this.value;
        if (value === undefined || value === null) {
            return null;
        }

        if ('$set' in value && !!value['$set'] && value['$set'].constructor == Object) {
            value['$set'] = new EncryptionDocument(this.cipher, this.nonce, value['$set']).encrypt();
        }

        if ('$setOnInsert' in value && !!value['$setOnInsert'] && value['$setOnInsert'].constructor == Object) {
            value['$setOnInsert'] = new EncryptionDocument(this.cipher, this.nonce, value['$setOnInsert']).encrypt();
        }

        return value;
    }

    decrypt() {
        throw new NotImplementedException();
    }
}

export class DatabaseEncryption {
    constructor(private cipher: Cipher, private nonce: Buffer) {}

    private static getGeneralJsonDict(map: any, message: string) {
        const str = JSON.stringify(map);
        const json = JSON.parse(str);
        if (json.constructor != Object) { // not dictionary
            throw new InvalidParameterException(message);
        }
        return json;
    }

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

        const edoc = new EncryptionDocument(this.cipher, this.nonce, json);
        return isEncrypt ? edoc.encrypt() : edoc.decrypt();
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

        return new EncryptionFilter(this.cipher, this.nonce, json).encrypt();
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

        return new EncryptionUpdate(this.cipher, this.nonce, json).encrypt();
    }
}
