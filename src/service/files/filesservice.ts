import { HttpMethod } from "../../connection/httpmethod";
import { HttpResponseParser } from "../../connection/httpresponseparser";
import { StreamResponseParser } from "../../connection/streamresponseparser";
import {  NetworkException, NodeRPCException } from "../../exceptions";
import { HttpClient } from "../../connection/httpclient";
import { ServiceEndpoint } from "../../connection/serviceendpoint";
import { Logger } from '../../utils/logger';
import { RestService } from "../restservice";
import { FileInfo } from "./fileinfo";
import { checkArgument, checkNotNull } from "../../utils/utils";

export class FilesService extends RestService {
	private static LOG = new Logger("FilesService");

	private static API_FILES_ENDPOINT = "/api/v2/vault/files";

    constructor(serviceContext: ServiceEndpoint, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}

	public async download(path: string): Promise<Buffer> {
		checkNotNull(path, "Remote file path is mandatory.");
		try {
			let dataBuffer = Buffer.alloc(0);
			await this.httpClient.send<void>(`${FilesService.API_FILES_ENDPOINT}/${path}`, HttpClient.NO_PAYLOAD,
			{
				onData(chunk: Buffer): void {
					dataBuffer = Buffer.concat([dataBuffer, chunk]);
				},
				onEnd(): void {
					// Process end.
				}
      		} as StreamResponseParser,
			HttpMethod.GET);
			FilesService.LOG.debug("Downloaded " + Buffer.byteLength(dataBuffer) + " byte(s).");
			return dataBuffer;
		} catch (e) {
			this.handleError(e);
		}
	}

	/**
	 * Upload a file to the files service.
	 *
	 * @param path the path in files service.
	 * @param data file's content.
	 * @param is_public 'true' will return the cid of the file which can be used to access from global ipfs gateway.
	 * @param script_name used when is_public is true, this will create a new downloading script with name script_name.
	 */
	public async upload(path: string, data: Buffer | string, is_public = false, script_name?: string): Promise<string> {
		checkNotNull(path, "Remote destination path is mandatory.");
		checkNotNull(data, "data must be provided.");
		const content: Buffer = data instanceof Buffer ? data : Buffer.from(data);
		checkArgument(content.length > 0, "No data to upload.");
		FilesService.LOG.debug("Uploading " + Buffer.byteLength(content) + " byte(s).");

		let urlArgsStr = '';
		if (is_public) {
			checkArgument(!!script_name, "Script name must be provided when is_public is true.");
			urlArgsStr = `?public=true&script_name=${script_name}`
		}

		try {
			return await this.httpClient.send<string>(`${FilesService.API_FILES_ENDPOINT}/${path}${urlArgsStr}`, content,
				<HttpResponseParser<string>> {
					deserialize(content: any): string {
						return JSON.parse(content)["cid"];
					}
				}, HttpMethod.PUT);
		} catch (e) {
			this.handleError(e);
		}
	}

	/**
	 * Returns the list of all files in a given folder.
	 *
	 * @param path the path for the remote folder
	 * @return the new CompletionStage, the result is List if success; null otherwise
	 */
	public async list(path: string): Promise<FileInfo[]> {
		try {
			let fileInfos: FileInfo[] = await this.httpClient.send<FileInfo[]>(`${FilesService.API_FILES_ENDPOINT}/${path}?comp=children`, HttpClient.NO_PAYLOAD, <HttpResponseParser<FileInfo[]>> {
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

			return fileInfos;
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
	public async stat(path: string): Promise<FileInfo> {
		try {
			let fileInfo: FileInfo = await this.httpClient.send<FileInfo>(`${FilesService.API_FILES_ENDPOINT}/${path}?comp=metadata`, HttpClient.NO_PAYLOAD, <HttpResponseParser<FileInfo>> {
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

			return fileInfo;
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
	public async hash(path: string): Promise<string> {
		try {
			let hash: string = await this.httpClient.send<string>(`${FilesService.API_FILES_ENDPOINT}/${path}?comp=hash`, HttpClient.NO_PAYLOAD, <HttpResponseParser<string>> {
				deserialize(content: any): string {
					return JSON.parse(content)['hash'];
				}
			}, HttpMethod.GET);

			return hash;
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
	 public async move(source: string, target: string): Promise<string> {
		try {
			let result = await this.httpClient.send<string>(`${FilesService.API_FILES_ENDPOINT}/${source}?to=${target}`, HttpClient.NO_PAYLOAD, <HttpResponseParser<string>> {
				deserialize(content: any): string {
					return JSON.parse(content)['name'];
				}
			}, HttpMethod.PATCH);

			return result;
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
	public async copy(source: string, target: string): Promise<string> {
		try {
			let result = await this.httpClient.send<string>(`${FilesService.API_FILES_ENDPOINT}/${source}?dest=${target}`, HttpClient.NO_PAYLOAD, <HttpResponseParser<string>> {
				deserialize(content: any): string {
					return JSON.parse(content)['name'];
				}
			}, HttpMethod.PUT);

			return result;
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
	public async delete(path: string): Promise<void> {
		try {
			await this.httpClient.send<void>(`${FilesService.API_FILES_ENDPOINT}/${path}`, HttpClient.NO_PAYLOAD, HttpClient.NO_RESPONSE, HttpMethod.DELETE);
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