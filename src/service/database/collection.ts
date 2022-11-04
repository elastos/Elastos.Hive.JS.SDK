export class Collection {
    private name: string;
    private is_encrypt: boolean;
    private encrypt_method: string;

    setName(name: string) {
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    setEncrypt(encrypt: boolean) {
        this.is_encrypt = encrypt;
    }

    isEncrypt(): boolean {
        return this.is_encrypt;
    }

    setEncryptMethod(method: string) {
        this.encrypt_method = method;
    }

    getEncryptMethod(): string {
        return this.encrypt_method;
    }
}
