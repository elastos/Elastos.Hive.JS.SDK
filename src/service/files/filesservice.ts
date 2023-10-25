import {checkArgument, checkNotNull} from "../../utils/utils";
import {EncryptionValue} from "../../utils/encryption/encryptionvalue";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {RestServiceT} from "../restservice";
import {FileInfo} from "./fileinfo";
import {FilesAPI} from "./filesapi";
import {ProgressDisposer} from "./progressdisposer";
import {ProgressHandler} from "./progresshandler";
import {HashInfo} from "./hashinfo";

/**
 * The files service is for files management on the node.
 */
export class FilesService extends RestServiceT<FilesAPI> {
    constructor(serviceContext: ServiceEndpoint) {
		super(serviceContext);
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
        checkNotNull(path, "Remote file path is mandatory.");

        let cb = async (api: FilesAPI) => {
            return api.download(await this.getAccessToken(), path);
        }
        let moreConfig: any = {
            onDownloadProgress: (progressEvent: any) => {
                let percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                progressHandler.onProgress(percent)
            }
        }

        return await this.callAPI(FilesAPI, cb, moreConfig);
	}

	/**
	 * Upload a file to the files service.
	 *
	 * @param path the path in files service.
	 * @param data file's content.
     * @param progressHandler callback for the process of uploading with percent value. Only supported on browser side.
	 * @param publicOnIPFS 'true' will return the cid of the file which can be used to access from global ipfs gateway.
     *                      The file can be download by AnonymousScriptRunner.downloadAnonymousFile() with file path.
     * @param isEncrypt whether the content of the file is encrypted.
     */
	protected async uploadInternal(path: string,
        data: Buffer | string,
        progressHandler: ProgressHandler = new ProgressDisposer(),
        publicOnIPFS = false,
        isEncrypt = false
    ): Promise<string> {
		checkNotNull(path, "Remote destination path is mandatory.");
		checkNotNull(data, "data must be provided.");
		const content: Buffer = data instanceof Buffer ? data : Buffer.from(data);
		checkArgument(content.length > 0, "No data to upload.");

		const encryptMethod = isEncrypt ? EncryptionValue.ENCRYPT_METHOD : null;

        let cb = async (api: FilesAPI) => {
            return await api.upload(await this.getAccessToken(),
                publicOnIPFS, isEncrypt, encryptMethod, path, {
                    'data': content
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
     * Upload a file to the files service.
     *
     * @param path the path in files service.
     * @param data file's content.
     * @param progressHandler callback for the process of uploading with percent value. Only supported on browser side.
     * @param publicOnIPFS 'true' will return the cid of the file which can be used to access from global ipfs gateway.
     *                      The file can be downloaded by AnonymousScriptRunner.downloadAnonymousFile() with file path.
     */
    async upload(path: string, data: Buffer | string,
                 progressHandler: ProgressHandler = new ProgressDisposer(),
                 publicOnIPFS = false): Promise<string> {
        return this.uploadInternal(path, data, progressHandler, publicOnIPFS);
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
	async hash(path: string): Promise<HashInfo> {
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
