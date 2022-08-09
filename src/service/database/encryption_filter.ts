import {BasicEncryptionValue, EncryptionValue} from "../../utils/encryption/encrypt_value";
import {NotImplementedException} from "../../exceptions";
import {Logger} from "../../utils/logger";

export class EncryptionFilter extends EncryptionValue {
    private static LOG = new Logger("EncryptionFilter");

    constructor(value) {
        super(value);
    }

    encrypt() {
        const value = this.value;
        if (value === undefined || value === null) {
            return null;
        }

        if (value.constructor != Object) {
            EncryptionFilter.LOG.info(`Unexpected filter type ${typeof value}.`);
            return value;
        }

        let result = {};
        const isReservedKey = (v) => v.startsWith('$');

        for (const [k, v] of Object.entries(value)) {
            const enval = new BasicEncryptionValue(v);
            if (!isReservedKey(k) && enval.isBasicType()) { // query field with value.
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
