import { InvalidParameterException, NetworkException, NodeRPCException } from '../../exceptions';
import { Condition } from './condition';
import { Executable } from './executable';
import { ServiceEndpoint } from '../../connection/serviceendpoint';
import { HttpClient } from '../../connection/httpclient';
import { HttpResponseParser } from '../../connection/httpresponseparser';
import { StreamResponseParser } from '../../connection/streamresponseparser';
import { Context } from './context';
import { HttpMethod } from '../../connection/httpmethod';
import { Logger } from '../../utils/logger';
import { checkNotNull, checkArgument } from '../../utils/utils';
import { RestService } from '../restservice';
import { AppContext } from "../..";

interface HiveUrl {
	targetUsrDid: string,
	targetAppDid: string,
	scriptName: string,
	params: string
}

export class ScriptingService extends RestService {
	private static LOG = new Logger("ScriptingService");

	private static API_SCRIPT_ENDPOINT = "/api/v2/vault/scripting";
	private static API_SCRIPT_STREAM_ENDPOINT = "/api/v2/vault/scripting/stream"; 

    constructor(serviceContext: ServiceEndpoint, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}
    
	/**
	* Let the vault owner register a script on his vault for a given application.
	*
	* @param name the name of script to register
	* @param condition the condition on which the script could be executed.
	* @param executable the executable body of the script with preset routines
	* @param allowAnonymousUser whether allows anonymous user.
	* @param allowAnonymousApp whether allows anonymous application.
	* @return Void
	*/
	async registerScript(name: string, executable: Executable, condition?: Condition, allowAnonymousUser?: boolean, allowAnonymousApp?: boolean) : Promise<void> {
		checkNotNull(name, "Missing script name.");
		checkNotNull(executable, "Missing executable script");

        try {	
			await this.httpClient.send<void>(`${ScriptingService.API_SCRIPT_ENDPOINT}/${name}`,
			{
				"executable": executable,
				"condition": condition,
				"allowAnonymousUser": allowAnonymousUser,
				"allowAnonymousApp": allowAnonymousApp
			},
			HttpClient.NO_RESPONSE,
			HttpMethod.PUT);
		} 
		catch (e){
			this.handleError(e);
		}
	}
	
	// TODO: handle this method signature
	// async registerScriptWithoutCondition(name: string, executable: Executable, allowAnonymousUser: boolean, allowAnonymousApp: boolean) : Promise<void>{
	// 	this.registerScript(name, executable, undefined, allowAnonymousUser, allowAnonymousApp);
	// }
		
	async unregisterScript(name: string) : Promise<void>{
		try {	
			await this.httpClient.send<void>(`${ScriptingService.API_SCRIPT_ENDPOINT}/${name}`, HttpClient.NO_PAYLOAD, HttpClient.NO_RESPONSE, HttpMethod.DELETE);
		} 
		catch (e){
			this.handleError(e);
		}
	}

	async callScript<T>(name: string, params: any, targetDid: string, targetAppDid: string): Promise<T> {
		checkNotNull(name, "Missing script name.");
		checkNotNull(params, "Missing parameters to run the script");
		checkNotNull(targetDid, "Missing target user DID");
		checkNotNull(targetAppDid, "Missing target application DID");

		try {
			let context = new Context().setTargetDid(targetDid).setTargetAppDid(targetAppDid);
			let returnValue : T  = await this.httpClient.send<T>(`${ScriptingService.API_SCRIPT_ENDPOINT}/${name}`, { "context": context, "params": params }, <HttpResponseParser<T>> {
				deserialize(content: any): T {
					ScriptingService.LOG.debug("CALLSCRIPT: " + content);
					return JSON.parse(content) as T;
				}
			}, HttpMethod.PATCH);
			
			return returnValue;
		} 
		catch (e) {
			this.handleError(e);
		}
	}

	async callScriptUrl<T>(name: string, params: string, targetDid: string, targetAppDid: string): Promise<T> {
		checkNotNull(name, "Missing script name.");
		checkNotNull(params, "Missing parameters to run the script");
		checkNotNull(targetDid, "Missing target user DID");
		checkNotNull(targetAppDid, "Missing target application DID");
		
		try{
			let returnValue: T  = await this.httpClient.send<T>(`${ScriptingService.API_SCRIPT_ENDPOINT}/${name}/${targetDid}@${targetAppDid}/${params}`, HttpClient.NO_PAYLOAD, <HttpResponseParser<T>> {
				deserialize(content: any): T {
					return JSON.parse(content) as T;
				}
			},HttpMethod.GET);
			
			return returnValue;
		} 
		catch (e) {
			this.handleError(e);
		}
	}

    /**
     * Upload file by transaction ID
     *
     * @param transactionId Transaction ID which can be got by the calling of the script 'fileUpload'.
     * @param data File content.
     * @param callback The callback to get the progress of uploading with percent value. Only supported on browser side.
     */
	async uploadFile(transactionId: string, data: Buffer | string,
                            callback?: (process: number) => void): Promise<void> {
		checkNotNull(transactionId, "Missing transactionId.");
		checkNotNull(data, "data must be provided.");
		const content: Buffer = data instanceof Buffer ? data : Buffer.from(data);
		checkArgument(content.length > 0, "No data to upload.");
		try {
			ScriptingService.LOG.debug("Uploading " + content.byteLength + " byte(s)");
			await this.httpClient.send<void>(`${ScriptingService.API_SCRIPT_STREAM_ENDPOINT}/${transactionId}`,
                                             content, HttpClient.NO_RESPONSE, HttpMethod.PUT, callback);
		} catch (e) {
			this.handleError(e);
		}		
	}

    /**
     * Download file by transaction ID
     *
     * @param transactionId Transaction ID which can be got by the calling of the script 'fileDownload'.
     * @param callback The callback to get the progress of downloading with percent value. Only supported on browser side.
     */
	async downloadFile(transactionId: string, callback?: (process: number) => void): Promise<Buffer> {
		checkNotNull(transactionId, "Missing transactionId.");
		try {
			let dataBuffer = Buffer.alloc(0);
			await this.httpClient.send<void>(`${ScriptingService.API_SCRIPT_STREAM_ENDPOINT}/${transactionId}`, HttpClient.NO_PAYLOAD, 
			{
				onData(chunk: Buffer): void {
					dataBuffer = Buffer.concat([dataBuffer, chunk]);
				},
				onEnd(): void {
					// Process end.
				}
      		} as StreamResponseParser,
			HttpMethod.GET, null, callback);

			ScriptingService.LOG.debug("Downloaded " + Buffer.byteLength(dataBuffer) + " byte(s).");
			return dataBuffer;
		} catch (e) {
			this.handleError(e);
		}
	}

	private parseHiveUrl(hiveUrl: string): HiveUrl {
		if (!hiveUrl || !hiveUrl.startsWith('hive://')) {
			throw new InvalidParameterException('Invalid hive url: no hive prefix');
		}
		const parts = hiveUrl.substring('hive://'.length).split('/');
		if (parts.length < 2) {
			throw new InvalidParameterException('Invalid hive url: must contain at least one slash');
		}
		const dids = parts[0].split('@');
		if (dids.length !== 2) {
			throw new InvalidParameterException('Invalid hive url: must contain two DIDs');
		}
		const values = parts[1].split('?params=');
		if (values.length != 2) {
			throw new InvalidParameterException('Invalid hive url: must contain script name and params');
		}
		return {
			targetUsrDid: dids[0],
			targetAppDid: dids[1],
			scriptName: values[0],
			params: values[1]
		}
	}

	/**
	 * This is the compatible implementation for downloading file by the hive url
	 * which comes from v1 version SDK. The hive url definition is as this format:
	 * <br>
	 * hive://&lt;targetDid&gt;@&lt;targetAppDid&gt;/&lt;scriptName&gt;?params=&lt;paramJsonStr&gt;
	 *
	 * @param hiveUrl
	 */
	async downloadFileByHiveUrl(hiveUrl: string): Promise<Buffer> {
		const params = this.parseHiveUrl(hiveUrl);

		// Get the provider address for targetDid.
		const targetUrl = await AppContext.getProviderAddressByUserDid(params.targetUsrDid, null, true);
		ScriptingService.LOG.info(`Got the hive url for targetDid: ${targetUrl}`);

		// Prepare the new scripting service for targetDid with current user's appContext.
		const endpoint = new ServiceEndpoint(this.getServiceContext().getAppContext(), targetUrl);
        const httpClient = new HttpClient(endpoint, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
        const scriptingService = new ScriptingService(endpoint, httpClient);

        // Call on the node contains targetDid vault.
		const result = await scriptingService.callScriptUrl(params.scriptName, params.params, params.targetUsrDid, params.targetAppDid);
		return await scriptingService.downloadFile(Object.values(result)[0]['transaction_id']);
	}

	private handleError(e: Error): unknown {
		if (e instanceof NodeRPCException) {
			throw e;
		}
		throw new NetworkException(e.message, e);
	}
}
