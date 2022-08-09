import {BasicEncryptionValue, EncryptionValue} from "../../utils/encryption/encrypt_value";

export class EncryptionFile extends EncryptionValue {
    constructor(value: Buffer | string) {
        super(value);
    }

    encrypt() {
        let data: string = this.value instanceof Buffer ? this.value.toString('utf8') : this.value;
        return new BasicEncryptionValue(data).encrypt();
    }

    decrypt() {
        let data: string = this.value instanceof Buffer ? this.value.toString('utf8') : this.value;
        return new BasicEncryptionValue(data, BasicEncryptionValue.TYPE_STRING).decrypt();
    }

}
