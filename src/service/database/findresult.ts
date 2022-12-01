import {JSONObject} from "@elastosfoundation/did-js-sdk";

/**
 * The result of the finding operation.
 */
export class FindResult {
    private items: JSONObject[];
    private is_encrypt: boolean;
    private encrypt_method: string;

    setItems(items: JSONObject[]) {
        this.items = items;
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

    getItems(): JSONObject[] {
        return this.items;
    }

    isEncrypt() {
        return this.is_encrypt;
    }

    getEncryptMethod() {
        return this.encrypt_method;
    }
}
