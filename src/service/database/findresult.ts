import {JSONObject} from "@elastosfoundation/did-js-sdk";

export class FindResult {
    private items: JSONObject[];
    private is_encrypt: boolean;
    private encrypt_method: string;

    setItems(items: JSONObject[]) {
        this.items = items;
    }

    getItems(): JSONObject[] {
        return this.items;
    }

    setEncrypt(encrypt: boolean) {
        this.is_encrypt = encrypt;
    }

    isEncrypt() {
        return this.is_encrypt;
    }

    setEncryptMethod(method: string) {
        this.encrypt_method = method;
    }

    getEncryptMethod() {
        return this.encrypt_method;
    }
}
