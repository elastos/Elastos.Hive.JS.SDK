import { HttpMethod } from "../../http/httpmethod";
import { HttpResponseParser } from "../../http/httpresponseparser";
import { StreamResponseParser } from "../../http/streamresponseparser";
import { NotFoundException, InvalidParameterException, NetworkException, NodeRPCException, ServerUnknownException, UnauthorizedException, VaultForbiddenException } from "../../exceptions";
import { HttpClient } from "../../http/httpclient";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';
import { RestService } from "../restservice";
import { FileInfo } from "./fileinfo";
import { File } from "../../domain/file";
import { checkArgument } from "../../domain/utils";

export class FilesService extends RestService {
	private static LOG = new Logger("FilesService");

	private static API_FILES_ENDPOINT = "/api/v2/vault/files";

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}

	/**
	 * Start an async file download
	 * 
	 * @param path Path to the remote file to get
	 * @param dataParser Instance of StreamResponseParser
	 * 
	 * 
	 * Sample usage
	 * 
	 * public async testIt() {
	 * 		await this.download("someFile", <StreamResponseParser> {
	 * 			onData(chunk: any): void {
	 * 				// Process chunk of data.
	 * 			},
	 * 			onEnd(): void {
	 * 				// Process end.
	 * 			}
	 * 		});
	 * }
	 */

	public async download(path: string, dataParser: StreamResponseParser): Promise<void> {
		try {
			await this.httpClient.send<void>(`${FilesService.API_FILES_ENDPOINT}/${path}`, HttpClient.NO_PAYLOAD, dataParser, HttpMethod.GET);
		} catch (e) {
			this.handleError(e);
		}
	}

	public async upload(path: string, file: File): Promise<void> {
		checkArgument(file.exists(), "Can't find " + file.getAbsolutePath());
		try {
			let data = file.read();
			checkArgument(data && data.length > 0, "Provided file is empty: " + file.getAbsolutePath());
			await this.httpClient.send<void>(`${FilesService.API_FILES_ENDPOINT}/${path}`, data, HttpClient.NO_RESPONSE, HttpMethod.PUT);
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
					let rawFiles = JSON.parse(content)['value'];
					let files = [];
					for (let file in rawFiles) {
						let fileInfo = new FileInfo();
						fileInfo.setCreated(file["created"]);
						fileInfo.setUpdated(file["updated"]);
						fileInfo.setName(file["name"]);
						fileInfo.setAsFile(file["is_file"]);
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
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e.message, e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e.message, e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.message, e);
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e.message, e);
				default:
					throw new ServerUnknownException(e.message, e);
			}
		}
		throw new NetworkException(e.message, e);
	}
}