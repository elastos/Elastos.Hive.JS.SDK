import {Cipher} from "@elastosfoundation/did-js-sdk";
import {HttpMethod} from "../../connection/httpmethod";
import {HttpResponseParser} from "../../connection/httpresponseparser";
import {NetworkException, NodeRPCException} from "../../exceptions";
import {HttpClient} from "../../connection/httpclient";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {Logger} from '../../utils/logger';
import {APIResponse, RestServiceT} from "../restservice";
import {FileInfo} from "./fileinfo";
import {checkArgument, checkNotNull} from "../../utils/utils";
import {EncryptionFile} from "./encryptionfile";
import {FilesAPI} from "./filesapi";

export class FilesService extends RestServiceT<FilesAPI> {
	private static LOG = new Logger("FilesService");

	private static API_FILES_ENDPOINT = "/api/v2/vault/files";

	private encrypt: boolean;
	private cipher: Cipher;

    constructor(serviceContext: ServiceEndpoint, httpClient: HttpClient) {
		super(serviceContext, httpClient);
		this.encrypt = false;
	}

    public async encryptionInit(identifier: string, secureCode: number, storepass: string) {
        this.encrypt = true;
        this.cipher = await this.getEncryptionCipher(identifier, secureCode, storepass);
    }

    /**
     * Download the file content by the remote file path.
     *
     * @param path Relative remote file path.
     * @param callback Callback for the progress of downloading with percent value. Only supported on browser side.
     */
	async download(path: string, callback?: (process: number) => void): Promise<Buffer> {
		checkNotNull(path, "Remote file path is mandatory.");

		try {
            const response = await (await this.getAPI(FilesAPI, {
                    onDownloadProgress: function (progressEvent) {
                        if (callback) {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            callback(percent);
                        }
                    }
                })).download(await this.getAccessToken(), path);
            const result = new APIResponse(response).getStream();

			FilesService.LOG.debug("Downloaded " + Buffer.byteLength(result) + " byte(s).");

			return this.encrypt ? Buffer.from(new EncryptionFile(this.cipher, result).decrypt()) : result;
		} catch (e) {
			await this.handleResponseError(e);
		}
	}

	/**
	 * Upload a file to the files service.
	 *
	 * @param path the path in files service.
	 * @param data file's content.
	 * @param isPublic 'true' will return the cid of the file which can be used to access from global ipfs gateway.
	 * @param scriptName used when is_public is true, this will create a new downloading script with name script_name.
	 * @param callback callback for the process of uploading with percent value. Only supported on browser side.
	 */
	async upload(path: string, data: Buffer | string, callback?: (process: number) => void,
                 isPublic = false, scriptName?: string): Promise<string> {
		checkNotNull(path, "Remote destination path is mandatory.");
		checkNotNull(data, "data must be provided.");
		const content: Buffer = data instanceof Buffer ? data : Buffer.from(data);
		checkArgument(content.length > 0, "No data to upload.");
        const encryptData = this.encrypt ? Buffer.from(new EncryptionFile(this.cipher, content).encrypt()) : content;

		FilesService.LOG.debug("Uploading " + Buffer.byteLength(content) + " byte(s).");

        let [isPublic_, scriptName_, isEncrypt, encryptMethod] = [null, null, null, null];
        if (isPublic) {
            checkArgument(!!scriptName, "Script name must be provided when is_public is true.");
            isPublic_ = true;
            scriptName_ = scriptName;
		}
		if (this.encrypt) {
            isEncrypt = true;
            encryptMethod = 'user_did';
        }

		try {
            const response = await (await this.getAPI(FilesAPI, {
                    onUploadProgress: function (progressEvent) {
                        if (callback) {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            callback(percent);
                        }
                    }
                })).upload(await this.getAccessToken(),
                           isPublic_, scriptName_, isEncrypt, encryptMethod, path, encryptData);
            return new APIResponse(response).get(<HttpResponseParser<string>>{
                deserialize(jsonObj: any) {
                    return jsonObj["cid"];
                }});
		} catch (e) {
			await this.handleResponseError(e);
		}
	}

	/**
	 * Returns the list of all files in a given folder.
	 *
	 * @param path the path for the remote folder
	 * @return the new CompletionStage, the result is List if success; null otherwise
	 */
	async list(path: string): Promise<FileInfo[]> {
		try {
			return await this.httpClient.send<FileInfo[]>(`${FilesService.API_FILES_ENDPOINT}/${path}?comp=children`,
                HttpClient.NO_PAYLOAD, <HttpResponseParser<FileInfo[]>> {
                    deserialize(content: any): FileInfo[] {
                        let rawFiles = JSON.parse(content)["value"];
                        let files = [];
                        for (let file of rawFiles) {
                            let fileInfo = new FileInfo();
                            fileInfo.setCreated(file["created"]);
                            fileInfo.setUpdated(file["updated"]);
                            fileInfo.setName(file["name"]);
                            fileInfo.setAsFile(file["is_file"]);
                            fileInfo.setSize(file["size"]);
                            files.push(fileInfo);
                        }
                        return files;
                    }
                }, HttpMethod.GET);
		} catch (e) {
			this.handleError(e);
		}
	}

	/**
	 * Information about the target file or folder.
	 *
	 * @param path the path for the remote file or folder
	 * @return the new CompletionStage, the result is FileInfo
	 *		 if success; null otherwise
	 */
	async stat(path: string): Promise<FileInfo> {
		try {
			return await this.httpClient.send<FileInfo>(`${FilesService.API_FILES_ENDPOINT}/${path}?comp=metadata`,
                HttpClient.NO_PAYLOAD, <HttpResponseParser<FileInfo>> {
                    deserialize(content: any): FileInfo {
                        let file = JSON.parse(content);
                        let newFileInfo = new FileInfo();
                        newFileInfo.setCreated(file["created"]);
                        newFileInfo.setUpdated(file["updated"]);
                        newFileInfo.setName(file["name"]);
                        newFileInfo.setAsFile(file["is_file"]);
                        return newFileInfo;
                    }
                }, HttpMethod.GET);
		} catch (e) {
			this.handleError(e);
		}
	}
 
	/**
	 * Returns the SHA256 hash of the given file.
	 *
	 * @param path path for the remote file
	 * @return the new CompletionStage, the result is the base64 hash string
	 *		 if the hash successfully calculated; null otherwise
	 */
	async hash(path: string): Promise<string> {
		try {
			return await this.httpClient.send<string>(`${FilesService.API_FILES_ENDPOINT}/${path}?comp=hash`,
                HttpClient.NO_PAYLOAD, <HttpResponseParser<string>> {
                    deserialize(content: any): string {
                        return JSON.parse(content)['hash'];
                    }
                }, HttpMethod.GET);
		} catch (e) {
			this.handleError(e);
		}
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
		try {
			return await this.httpClient.send<string>(`${FilesService.API_FILES_ENDPOINT}/${source}?to=${target}`,
                HttpClient.NO_PAYLOAD, <HttpResponseParser<string>> {
                    deserialize(content: any): string {
                        return JSON.parse(content)['name'];
                    }
                }, HttpMethod.PATCH);
		} catch (e) {
			this.handleError(e);
		}
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
		try {
			return await this.httpClient.send<string>(`${FilesService.API_FILES_ENDPOINT}/${source}?dest=${target}`,
                HttpClient.NO_PAYLOAD, <HttpResponseParser<string>> {
                    deserialize(content: any): string {
                        return JSON.parse(content)['name'];
                    }
                }, HttpMethod.PUT);
		} catch (e) {
			this.handleError(e);
		}
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
		try {
			await this.httpClient.send<void>(`${FilesService.API_FILES_ENDPOINT}/${path}`,
                HttpClient.NO_PAYLOAD, HttpClient.NO_RESPONSE, HttpMethod.DELETE);
		} catch (e) {
			this.handleError(e);
		}
	}
	
	private handleError(e: Error): unknown {
		if (e instanceof NodeRPCException) {
			throw e;
		}
		throw new NetworkException(e.message, e);
	}
}