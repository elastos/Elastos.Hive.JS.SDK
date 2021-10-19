import { HttpMethod, HttpResponseParser, NotFoundException } from "../..";
import { DeserializationError, InvalidParameterException, NetworkException, NodeRPCException, NotImplementedException, ServerUnknownException, UnauthorizedException, VaultForbiddenException } from "../../exceptions";
import { HttpClient } from "../../http/httpclient";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';
import { RestService } from "../restservice";
import { BackupResult } from "./backupresult";

export class BackupService extends RestService {
	private static LOG = new Logger("BackupService");

	private static API_BACKUP_ENDPOINT = "/api/v2/vault/content";

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}

	public async startBackup(credential: string) : Promise<void>{
		try {	
			await this.httpClient.send<void>(`${BackupService.API_BACKUP_ENDPOINT}/?to=hive_node`, { "credential": credential }, HttpClient.NO_RESPONSE, HttpMethod.POST);
		} catch (e){
			this.handleError(e);
		}
	}

	public async stopBackup(): Promise<void> {
		return await new Promise<void>((resolve, reject) => {
			reject(new NotImplementedException());
		});
	}

	public async restoreFrom(credential: string) : Promise<void>{
		try {	
			await this.httpClient.send<void>(`${BackupService.API_BACKUP_ENDPOINT}/?from=hive_node`, { "credential": credential }, HttpClient.NO_RESPONSE, HttpMethod.POST);
		} catch (e){
			this.handleError(e);
		}
	}

	public async stopRestore(): Promise<void> {
		return await new Promise<void>((resolve, reject) => {
			reject(new NotImplementedException());
		});
	}

	public async checkResult() : Promise<BackupResult> {
		try {
			let state = await this.httpClient.send<BackupResult>(BackupService.API_BACKUP_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<BackupResult>> {
				deserialize(content: any): BackupResult {
					let state: string = JSON.parse(content)['state'];
					if (!state) {
						throw new DeserializationError("Unable to read state");
					}
					return state as BackupResult;
				}
			}, HttpMethod.GET);

			return state;
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