import {InvalidParameterException, NotImplementedException} from "../../exceptions";
import {Cipher, DecryptionStream} from "@elastosfoundation/did-js-sdk";

/**
 * Represent a value which needs be encrypted or decrypted.
 */
export abstract class EncryptionValue {
    private static TRUNK_SIZE = 4096;

    protected constructor(protected cipher: Cipher, protected value: any) {}

    protected encryptMessage(message: Buffer, nonce: Buffer): Buffer {
        return this.cipher.encrypt(message, nonce);
    }

    protected decryptMessage(message: Buffer, nonce: Buffer) {
        return this.cipher.decrypt(message, nonce);
    }

    private concatUint8Arrays(arr1: Uint8Array, arr2: Uint8Array) {
        let result = new Uint8Array(arr1.length + arr2.length);
        result.set(arr1, 0);
        result.set(arr2, arr1.length);
        return result;
    }

    protected encryptStream(data: Buffer): Buffer {
        const stream = this.cipher.createEncryptionStream();
        const [trunkSize, length, header] = [EncryptionValue.TRUNK_SIZE, data.length, stream.header()];
        let [start, result_array] = [0, header];

        while (start < length - 1) {
            const isLastPart = start + trunkSize >= length - 1;
            const len = isLastPart ? length - start : trunkSize;
            const encrypt_data = stream.pushAny(data.slice(start, start + len), isLastPart);

            result_array = result_array === null ? encrypt_data : this.concatUint8Arrays(result_array, encrypt_data);
            start += len;
        }

        return Buffer.from(result_array);
    }

    protected decryptStream(data: Buffer) {
        const headerLen = DecryptionStream.getHeaderLen();
        if (!data || data.length < headerLen) {
            throw new InvalidParameterException('Invalid cipher data to decrypt');
        }

        const header = data.slice(0, headerLen);
        const stream = this.cipher.createDecryptionStream(header);
        const [length, blockSize] = [data.length, EncryptionValue.TRUNK_SIZE + DecryptionStream.getEncryptExtraSize()];
        let [start, result_array] = [header.length, null];
        while (start < length - 1) {
            const isLastPart = start + blockSize >= length - 1;
            const len = isLastPart ? length - start : blockSize;
            const clearText = stream.pull(data.slice(start, start + len));

            result_array = result_array === null ? clearText : this.concatUint8Arrays(result_array, clearText);
            start += len;
        }

        return Buffer.from(result_array);
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

    constructor(cipher: Cipher, private nonce: Buffer, value, encryptedType?: number) {
        super(cipher, value);
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
        return this.encryptMessage(Buffer.from(strVal), this.nonce).toString('hex');
    }

    decrypt(): any {
        const cipherText = Buffer.from(this.value, 'hex');
        const clearText = this.decryptMessage(cipherText, this.nonce).toString();

        switch (this.encryptedType) {
            case BasicEncryptionValue.TYPE_STRING:
                return clearText;
            case BasicEncryptionValue.TYPE_BOOLEAN:
                return clearText === 'true';
            case BasicEncryptionValue.TYPE_NUMBER:
                return Number(clearText);
        }

        throw new InvalidParameterException(`Got an unexpected encrypted type value, ${this.value}(${typeof this.value})`);
    }
}
//