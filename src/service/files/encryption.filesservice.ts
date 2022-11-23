import {FilesService} from "./filesservice";
import {InvalidParameterException} from "../../exceptions";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {Cipher} from "@elastosfoundation/did-js-sdk";
import {EncryptionFile} from "./encryptionfile";
import {ProgressHandler} from "./progresshandler";
import {ProgressDisposer} from "./progressdisposer";
import {checkArgument} from "../../utils/utils";

/**
 * This is the encryption files service.
 */
export class EncryptionFilesService extends FilesService {
    private cipher: Cipher;

    constructor(serviceContext: ServiceEndpoint, cipher: Cipher) {
        super(serviceContext);
        this.cipher = cipher;
    }

    /**
     * Download the file content by the remote file path.
     *
     * @param path 	Relative remote file path.
     * @param progressHandler Callback for the progress of downloading with percent value.
     * 				Only supported on browser side.
     */
    async download(path: string, progressHandler: ProgressHandler = new ProgressDisposer()): Promise<Buffer> {
        const result = await super.download(path, progressHandler);
        return Buffer.from(new EncryptionFile(this.cipher, result).decrypt());
    }

    /**
     * Upload a file to the files service.
     *
     * @param path the path in files service.
     * @param data file's content.
     * @param progressHandler callback for the process of uploading with percent value. Only supported on browser side.
     * @param publicOnIPFS 'true' will return the cid of the file which can be used to access from global ipfs gateway.
     *                      The file can be download by AnonymousScriptRunner.downloadAnonymousFile() with file path.
     */
    async upload(path: string, data: Buffer | string,
                 progressHandler: ProgressHandler = new ProgressDisposer(),
                 publicOnIPFS = false): Promise<string> {
        checkArgument(!!data, 'Invalid data');
        if (publicOnIPFS)
            throw new InvalidParameterException('No support for public the encrypted file.');

        const encryptedData = Buffer.from(new EncryptionFile(this.cipher, data).encrypt())
        return super.uploadInternal(path, encryptedData, progressHandler, publicOnIPFS, true);
    }
}
