import { NetworkException, NodeRPCException } from '../../exceptions';
import { Condition } from './condition';
import { Executable } from './executable';
import { ServiceContext } from '../../http/servicecontext';
import { HttpClient } from '../../http/httpclient';
import { HttpResponseParser } from '../../http/httpresponseparser';
import { StreamResponseParser } from '../../http/streamresponseparser';
import { Context } from './context';
import { HttpMethod } from '../../http/httpmethod';
import { checkNotNull, checkArgument } from '../../domain/utils';
import { Logger } from '../../logger';
import { RestService } from '../restservice';

export class ScriptingService extends RestService {
	private static LOG = new Logger("ScriptingService");

	private static API_SCRIPT_ENDPOINT = "/api/v2/vault/scripting";
	private static API_SCRIPT_STREAM_ENDPOINT = "/api/v2/vault/scripting/stream"; 

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
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
	public async registerScript(name: string, executable: Executable, condition?: Condition, allowAnonymousUser?: boolean, allowAnonymousApp?: boolean) : Promise<void> {
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
		
	public async unregisterScript(name: string) : Promise<void>{
		try {	
			await this.httpClient.send<void>(`${ScriptingService.API_SCRIPT_ENDPOINT}/${name}`, HttpClient.NO_PAYLOAD, HttpClient.NO_RESPONSE, HttpMethod.DELETE);
		} 
		catch (e){
			this.handleError(e);
		}
	}

	public async callScript<T>(name: string, params: any, targetDid: string, targetAppDid: string): Promise<T> {
		checkNotNull(name, "Missing script name.");
		checkNotNull(params, "Missing parameters to run the script");
		checkNotNull(targetDid, "Missing target user DID");
		checkNotNull(targetAppDid, "Missing target application DID");

		try {
			let context = new Context().setTargetDid(targetDid).setTargetAppDid(targetAppDid);
			let returnValue : T  = await this.httpClient.send<T>(`${ScriptingService.API_SCRIPT_ENDPOINT}/${name}`, { "context": context, "params": params }, <HttpResponseParser<T>> {
				deserialize(content: any): T {
					return JSON.parse(content) as T;
				}
			}, HttpMethod.PATCH);
			
			return returnValue;
		} 
		catch (e) {
			this.handleError(e);
		}
	}

	public async callScriptUrl<T>( name: string, params: string, targetDid: string, targetAppDid: string): Promise<T> {
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
	
	public async uploadFile(transactionId: string, data: any): Promise<void> {
		checkNotNull(transactionId, "Missing transactionId.");
		checkArgument(data && data.length > 0, "No data to upload.");

		try {
			await this.httpClient.send<void>(`${ScriptingService.API_SCRIPT_STREAM_ENDPOINT}/${transactionId}`, data, HttpClient.NO_RESPONSE, HttpMethod.PUT);
		} catch (e) {
			this.handleError(e);
		}		
	}

	public async downloadFile(transactionId: string): Promise<Buffer> {
		checkNotNull(transactionId, "Missing transactionId.");
		try {
			let dataBuffer = Buffer.from("");
			await this.httpClient.send<void>(`${ScriptingService.API_SCRIPT_STREAM_ENDPOINT}/${transactionId}`, HttpClient.NO_PAYLOAD, 
			{
				onData(chunk: any): void {
					dataBuffer = Buffer.concat([dataBuffer, Buffer.from(chunk)]);
				},
				onEnd(): void {
					// Process end.
				}
      		} as StreamResponseParser,
			HttpMethod.GET);

			return dataBuffer;
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
