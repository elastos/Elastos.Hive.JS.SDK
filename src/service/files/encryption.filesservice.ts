import {FilesService} from "./filesservice";
import {ServiceEndpoint} from "../..";
import {Cipher} from "@elastosfoundation/did-js-sdk";
import {EncryptionFile} from "./encryptionfile";

export class EncryptionFilesservice extends FilesService {
    private cipher: Cipher;

    constructor(serviceContext: ServiceEndpoint) {
        super(serviceContext);
    }

    async encryptionInit(identifier: string, secureCode: number, storepass: string) {
        this.cipher = await this.getEncryptionCipher(identifier, secureCode, storepass);
    }

    async download(path: string, callback?: (process: number) => void): Promise<Buffer> {
        const result = await super.download(path, callback);
        return Buffer.from(new EncryptionFile(this.cipher, result).decrypt());
    }

    async upload(path: string, data: Buffer | string, callback?: (process: number) => void,
                 isPublic: boolean = false, scriptName?: string): Promise<string> {
        return super.uploadInternal(path, data, callback, isPublic, scriptName, true);
    }
}
