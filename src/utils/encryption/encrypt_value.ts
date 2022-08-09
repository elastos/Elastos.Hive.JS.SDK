import {InvalidParameterException, NotImplementedException} from "../../exceptions";
const sodium = require('libsodium-wrappers'); // TODO:

/**
 * Represent a value which needs be encrypted or decrypted.
 */
export abstract class EncryptionValue {

    protected readonly value: any;
    protected readonly secretKey: Uint8Array;
    protected readonly nonce: Uint8Array;

    protected constructor(value: any) {
        this.value = value;

        // TODO: get the secret key from current DID document.
        this.secretKey = sodium.from_hex('724b092810ec86d7e35c9d067702b31ef90bc43a7b598626749914d6a3e033ed');

        // fixed nonce value.
        let nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
        for (let i = 0; i < nonce.length; i++) {
            nonce[i] = 123;
        }
        this.nonce = nonce;
    }

    /**
     * Encrypt the value.
     *
     * @Override
     */
    encrypt() {
        throw new NotImplementedException();
    }

    /**
     * Decrypt the value.
     *
     * @Override
     */
    decrypt() {
        throw new NotImplementedException();
    }

}

/**
 * Basic type for JSON format: string, number, boolean.
 *
 * Caller check the type of the value. If not basic type, throws exception.
 */
export class BasicEncryptionValue extends EncryptionValue {
    public static readonly TYPE_STRING = 2;
    public static readonly TYPE_BOOLEAN = 8;
    public static readonly TYPE_NUMBER = 16;

    private readonly encryptedType: number;

    constructor(value, encryptedType?: number) {
        super(value);
        this.encryptedType = encryptedType;
    }

    isBasicType() {
        const type = typeof this.value;
        return type === 'number' || type == 'boolean' || type == 'string';
    }

    getEncryptedType(): number {
        switch (typeof this.value) {
            case "string":
                return BasicEncryptionValue.TYPE_STRING;
            case "boolean":
                return BasicEncryptionValue.TYPE_BOOLEAN;
            case "number":
                return BasicEncryptionValue.TYPE_NUMBER;
        }

        throw new InvalidParameterException(`Got an unexpected basic type value, ${this.value}(${typeof this.value})`);
    }

    encrypt(): string {
        const strVal = this.value.toString();

        let nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
        const arrData = new Uint8Array([...this.nonce, ...sodium.crypto_secretbox_easy(strVal, this.nonce, this.secretKey)]);
        return Buffer.from(arrData).toString("hex");
    }

    decrypt(): any {
        const arrData = Uint8Array.from(Buffer.from(this.value, "hex"));
        if (arrData.length < sodium.crypto_secretbox_NONCEBYTES) {
            throw new InvalidParameterException('Invalid document value, please make sure it is encrypted');
        }

        let nonce = arrData.slice(0, sodium.crypto_secretbox_NONCEBYTES),
            ciphertext = arrData.slice(sodium.crypto_secretbox_NONCEBYTES);
        const originalValue = sodium.crypto_secretbox_open_easy(ciphertext, this.nonce, this.secretKey, 'text');

        switch (this.encryptedType) {
            case BasicEncryptionValue.TYPE_STRING:
                return originalValue;
            case BasicEncryptionValue.TYPE_BOOLEAN:
                return originalValue === 'true';
            case BasicEncryptionValue.TYPE_NUMBER:
                return Number(originalValue);
        }

        throw new InvalidParameterException(`Got an unexpected encrypted type value, ${this.value}(${typeof this.value})`);
    }
}
