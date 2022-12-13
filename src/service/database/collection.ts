/**
 * Collection details.
 */
export class Collection {
    private name: string;
    private is_encrypt: boolean;
    private encrypt_method: string;

    setName(name: string) {
        this.name = name;
        return this;
    }

    setEncrypt(encrypt: boolean) {
        this.is_encrypt = encrypt;
        return this;
    }

    setEncryptMethod(method: string) {
        this.encrypt_method = method;
        return this;
    }

    getName(): string {
        return this.name;
    }

    isEncrypt(): boolean {
        return this.is_encrypt;
    }

    getEncryptMethod(): string {
        return this.encrypt_method;
    }
}
