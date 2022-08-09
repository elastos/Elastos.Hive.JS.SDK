import {EncryptionDocument} from "./encryption_doc";
import {EncryptionValue} from "../../utils/encryption/encrypt_value";
import {NotImplementedException} from "../../exceptions";

export class EncryptionUpdate extends EncryptionValue {
    constructor(value) {
        super(value);
    }

    encrypt() {
        const value = super.value;
        if (value === undefined || value === null) {
            return null;
        }

        if ('$set' in value && !!value['$set'] && value['$set'].constructor == Object) {
            value['$set'] = new EncryptionDocument(value['$set']).encrypt();
        }

        if ('$setOnInsert' in value && !!value['$setOnInsert'] && value['$setOnInsert'].constructor == Object) {
            value['$setOnInsert'] = new EncryptionDocument(value['$setOnInsert']).encrypt();
        }

        return value;
    }

    decrypt() {
        throw new NotImplementedException();
    }
}
