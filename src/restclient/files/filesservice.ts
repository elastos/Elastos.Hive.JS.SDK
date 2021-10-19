import { HttpClient } from "../../http/httpclient";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';
import { RestService } from "../restservice";
import { FileInfo } from "./fileinfo";
import { HttpMethod } from "../../http/httpmethod";
import { HttpResponseParser } from '../../http/httpresponseparser';

export class FilesService extends RestService {
	private static LOG = new Logger("FilesService");

	private static API_FILES_ENDPOINT = "/api/v2/vault/files/";

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}

	/**
	 * Returns the list of all files in a given folder.
	 *
	 * @param path the path for the remote folder
	 * @return the new CompletionStage, the result is List if success; null otherwise
	 */
	 public async list(path: string): Promise<FileInfo[]> {
		let fileInfos: FileInfo[] = await this.httpClient.send(`${FilesService.API_FILES_ENDPOINT}/${path}?comp=children`, HttpClient.NO_PAYLOAD, <HttpResponseParser<FileInfo[]>> {
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
	 }

	 /**
	  * Information about the target file or folder.
	  *
	  * @param path the path for the remote file or folder
	  * @return the new CompletionStage, the result is FileInfo
	  *		 if success; null otherwise
	  */
	 public async stat(path: string): Promise<FileInfo> {
		return await Promise.resolve(new FileInfo());
	 }
 
	 /**
	  * Returns the SHA256 hash of the given file.
	  *
	  * @param path path for the remote file
	  * @return the new CompletionStage, the result is the base64 hash string
	  *		 if the hash successfully calculated; null otherwise
	  */
	 public async hash(path: string): Promise<string> {
		return await Promise.resolve("");

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
	 public async move(source: string, target: string) {
	 }
 
	 /**
	  * Copies a file or a folder (recursively).
	  *
	  * @param source the path for the remote source file or folder
	  * @param target the path for the remote destination file or folder
	  * @return the new CompletionStage, the result is true if the file or folder
	  *		 successfully copied; false otherwise
	  */
	 public async copy(source: string, target: string) {

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

	 }
}