import {BasicEncryptionValue, EncryptionValue} from "../../utils/encryption/encrypt_value";
import {InvalidParameterException} from "../..";

export class EncryptionDocument extends EncryptionValue {
    constructor(value) {
        super(value);
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

            const val = new BasicEncryptionValue(value);
            return {
                '__binary__': val.encrypt(),
                '__type__': val.getEncryptedType(),
            }
        };

        if (!this.value || this.value.constructor !== Object) {
            throw new InvalidParameterException(`Invalid dictionary ${JSON.stringify(this.value)}(${typeof this.value})`);
        }

        let retVal = encryptRecursive(this.value);
        retVal['__encrypt__'] = 'user_did'; // record encrypt way
        return retVal;
    }

    decrypt() {
        const decryptRecursive = (value) => {
            if (value === undefined || value === null) {
                return null;
            }

            if (value.constructor == Object) { // dictionary
                if ('__binary__' in value && '__type__' in value) { // need decrypt to plaintext
                    return new BasicEncryptionValue(value['__binary__'], value['__type__']).decrypt();
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

        if ('__encrypt__' in this.value) {
            delete this.value['__encrypt__'];
        }

        let retVal = decryptRecursive(this.value);
        return JSON.parse(JSON.stringify(retVal)); // JSONObject
    }

}
