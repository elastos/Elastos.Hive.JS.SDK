import {Cipher} from "@elastosfoundation/did-js-sdk";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {Logger} from '../../utils/logger';
import {RestServiceT} from "../restservice";
import {FileInfo} from "./fileinfo";
import {checkArgument, checkNotNull} from "../../utils/utils";
import {EncryptionFile} from "./encryptionfile";
import {FilesAPI} from "./filesapi";
import {EncryptionValue} from "../../utils/encryption/encryptionvalue";
import { ProgressDisposer } from "./progressdisposer";
import { ProgressHandler } from "./progresshandler";
import { InvalidParameterException } from "../../exceptions";

const logger = new Logger("FileService")

export class FilesService extends RestServiceT<FilesAPI> {
	private encrypt: boolean;
	private cipher: Cipher;

    constructor(serviceContext: ServiceEndpoint) {
		super(serviceContext);
		this.encrypt = false;
	}

    async encryptionInit(identifier: string, secureCode: number, storepass: string) {
        this.encrypt = true;
        this.cipher = await this.getEncryptionCipher(identifier, secureCode, storepass);
    }

    /**
     * Download the file content by the remote file path.
     *
     * @param path 	Relative remote file path.
     * @param progressHandler Callback for the progress of downloading with percent value.
	 * 				Only supported on browser side.
     */
	async download(path: string,
		progressHandler: ProgressHandler = new ProgressDisposer()
	): Promise<Buffer> {
		if (path === null || path === '' )
			throw new InvalidParameterException("Remote file path missing or invalid.")

		let cb = async (api: FilesAPI) => {
            return api.download(await this.getAccessToken(), path);
        }
		let moreConfig: any = {
			onDownloadProgress: (progressEvent: any) => {
                let percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
				progressHandler.onProgress(percent)
            }
		}

        let result = await this.callAPI(FilesAPI, cb, moreConfig);
        logger.debug(`Downloaded<${path}> with ${Buffer.byteLength(result)} byte(s)`);

        return this.encrypt ? Buffer.from(new EncryptionFile(this.cipher, result).decrypt()) : result;
	}

	/**
	 * Upload a file to the files service.
	 *
	 * @param path the path in files service.
	 * @param data file's content.
	 * @param publicOnIPFS 'true' will return the cid of the file which can be used to access from global ipfs gateway.
	 * @param scriptName used when is_public is true, this will create a new downloading script with name script_name.
	 * @param progressHandler callback for the process of uploading with percent value. Only supported on browser side.
	 */
	async upload(path: string,
		data: Buffer | string,
		progressHandler: ProgressHandler = new ProgressDisposer(),
		publicOnIPFS = false,
		scriptName?: string
	): Promise<string> {
		if (path === null || path === '')
			throw new InvalidParameterException('Remote destination path missing or invalid');

		if (data == null)
			throw new InvalidParameterException('The data to put missing or invalid')


		const content: Buffer = data instanceof Buffer ? data : Buffer.from(data);
		checkArgument(content.length > 0, "No data to upload.");
        const encryptData = this.encrypt ? Buffer.from(new EncryptionFile(this.cipher, content).encrypt()) : content;

		logger.debug("Uploading " + Buffer.byteLength(content) + " byte(s).");

        let [isPublic_, scriptName_, isEncrypt, encryptMethod] = [null, null, null, null];
        if (publicOnIPFS) {
            checkArgument(!!scriptName, "Script name must be provided when is_public is true.");
            isPublic_ = true;
            scriptName_ = scriptName;
		}
		if (this.encrypt) {
            isEncrypt = true;
            encryptMethod = EncryptionValue.ENCRYPT_METHOD;
        }

		let cb = async (api: FilesAPI) => {
            return await api.upload(await this.getAccessToken(),
                isPublic_, scriptName_, isEncrypt, encryptMethod, path, {
                    'data': encryptData
                });
        }

		let moreConfig: any = {
            onUploadProgress: (progressEvent: any) => {
                let percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                progressHandler.onProgress(percent)
            }
        }
        return await this.callAPI(FilesAPI, cb, moreConfig);
	}

	/**
	 * Returns the list of all files in a given folder.
	 *
	 * @param path the path for the remote folder
	 * @return the new CompletionStage, the result is List if success; null otherwise
	 */
	async list(path: string): Promise<FileInfo[]> {
        return await this.callAPI(FilesAPI, async (api) => {
            return api.listChildren(await this.getAccessToken(), path);
        });
	}

	/**
	 * Information about the target file or folder.
	 *
	 * @param path the path for the remote file or folder
	 * @return the new CompletionStage, the result is FileInfo
	 *		 if success; null otherwise
	 */
	async stat(path: string): Promise<FileInfo> {
        return await this.callAPI(FilesAPI, async (api) => {
            return api.getMetadata(await this.getAccessToken(), path);
        });
	}

	/**
	 * Returns the SHA256 hash of the given file.
	 *
	 * @param path path for the remote file
	 * @return the new CompletionStage, the result is the base64 hash string
	 *		 if the hash successfully calculated; null otherwise
	 */
	async hash(path: string): Promise<string> {
        return await this.callAPI(FilesAPI, async (api) => {
            return api.getHash(await this.getAccessToken(), path);
        });
	}

	/**
	 * Moves (or renames) a file or folder.
	 *
	 * @param source the path to the file or folder to move
	 * @param target the path to the target file or folder
	 * @return The future object that would hold the result of moving operation.
	 *  	   When the result value is true, it means the file or folder has
	 *  	   been moved to target path in success. Otherwise, it will return
	 *  	   result with false.
	 */
	 async move(source: string, target: string): Promise<string> {
        return await this.callAPI(FilesAPI, async (api) => {
            return api.move(await this.getAccessToken(), source, target);
        });
	}

	/**
	 * Copies a file or a folder (recursively).
	 *
	 * @param source the path for the remote source file or folder
	 * @param target the path for the remote destination file or folder
	 * @return the new CompletionStage, the result is true if the file or folder
	 *		 successfully copied; false otherwise
	 */
	async copy(source: string, target: string): Promise<string> {
        return await this.callAPI(FilesAPI, async (api) => {
            return api.copy(await this.getAccessToken(), source, target);
        });
	}

	/**
	 * Deletes a file, or a folder. In case the given path is a folder,
	 * deletion is recursive.
	 *
	 * @param path the path for the remote file or folder
	 * @return the new CompletionStage, the result is true if the file or folder
	 *		 successfully deleted; false otherwise
	 */
	async delete(path: string): Promise<void> {
		await this.callAPI(FilesAPI, async (api) => {
			return api.delete(await this.getAccessToken(), path);
        });
	}
}
