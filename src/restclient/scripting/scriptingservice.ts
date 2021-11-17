import { InvalidParameterException, NetworkException, NodeRPCException, NotFoundException, ServerUnknownException, UnauthorizedException, VaultForbiddenException } from '../../exceptions';
import { Condition } from './condition';
import { Executable } from './executable';
import { ServiceContext } from '../../http/servicecontext';
import { HttpClient } from '../../http/httpclient';
import { HttpResponseParser } from '../../http/httpresponseparser';
import { Class } from '../../class';
import { Context } from './context';
import { HttpMethod } from '../../http/httpmethod';
import { checkNotNull } from '../../domain/utils';
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
			if (e instanceof NodeRPCException) {

				// TODO: waiting for the codes
				switch (e.getCode()) {
					case NodeRPCException.UNAUTHORIZED:
						throw new UnauthorizedException(e.message, e);
					case NodeRPCException.FORBIDDEN:
						throw new VaultForbiddenException(e.message, e);
					case NodeRPCException.BAD_REQUEST:
						throw new InvalidParameterException(e.message, e);
					default:
						throw new ServerUnknownException(e.message, e);
				}
			}
			throw new NetworkException(e.message, e);
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
	
	public async uploadFile(transactionId: string, fileContent: any): Promise<void> {
		checkNotNull(transactionId, "Missing transactionId.");
		checkNotNull(fileContent, "Missing file content.");

		try {
			await this.httpClient.send<void>(`${ScriptingService.API_SCRIPT_STREAM_ENDPOINT}/${transactionId}`, fileContent, HttpClient.NO_RESPONSE, HttpMethod.POST);
		} catch (e) {
			if (e instanceof NodeRPCException) {
				throw new ServerUnknownException(e.message, e);
			}
			throw new NetworkException(e.message, e);
		}		
	}

	public async downloadFile<T>(transactionId: string): Promise<T> {
		checkNotNull(transactionId, "Missing transactionId.");

		try {
			let returnValue : T  = await this.httpClient.send<T>(`${ScriptingService.API_SCRIPT_STREAM_ENDPOINT}/${transactionId}`, HttpClient.NO_PAYLOAD, <HttpResponseParser<T>>{
				deserialize(content: any): T {
					return content as T;
				}
			}, HttpMethod.GET);
			return returnValue;
		} catch (e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e.getMessage(), e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e.getMessage(), e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage(), e);
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e.getMessage(), e);
				default:
					throw new ServerUnknownException(e.getMessage(), e);
			}
		}
	}
}
