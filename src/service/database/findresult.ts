import {JSONObject} from "@elastosfoundation/did-js-sdk";

export class FindResult {
    private items: JSONObject[];
    private _isEncrypt: boolean;
    private encryptMethod: string;

    setItems(items: JSONObject[]) {
        this.items = items;
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

    getItems(): JSONObject[] {
        return this.items;
    }

    isEncrypt() {
        return this._isEncrypt;
    }

    getEncryptMethod() {
        return this.encryptMethod;
    }
}
