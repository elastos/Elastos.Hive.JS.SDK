export class Collection {
    private name: string;
    private _isEncrypt: boolean;
    private encryptMethod: string;

    setName(name: string) {
        this.name = name;
        return this;
    }

    setEncrypt(encrypt: boolean) {
        this._isEncrypt = encrypt;
        return this;
    }

    setEncryptMethod(method: string) {
        this.encryptMethod = method;
        return this;
    }

    getName(): string {
        return this.name;
    }

    isEncrypt(): boolean {
        return this._isEncrypt;
    }

    getEncryptMethod(): string {
        return this.encryptMethod;
    }
}
