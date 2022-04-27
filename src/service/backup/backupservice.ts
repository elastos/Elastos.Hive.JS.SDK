import {
	NetworkException,
	NodeRPCException,
	NotImplementedException
} from "../../exceptions";
import { HttpClient } from "../../connection/httpclient";
import { ServiceContext } from "../../connection/servicecontext";
import { Logger } from '../../utils/logger';
import { RestService } from "../restservice";
import {BackupResult, BackupResultResult, BackupResultState} from "./backupresult";
import { HttpMethod } from "../../connection/httpmethod";
import { HttpResponseParser } from '../../connection/httpresponseparser';
import {CredentialCode} from "./credentialcode";
import {BackupContext} from "./backupcontext";

export class BackupService extends RestService {
	private static LOG = new Logger("BackupService");
	private static API_BACKUP_ENDPOINT = "/api/v2/vault/content";

	private credentialCode: CredentialCode;

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}

	public setBackupContext(backupContext: BackupContext) {
		this.credentialCode = new CredentialCode(this.serviceContext, backupContext);
	}

	public async startBackup() : Promise<void>{
		try {
			await this.httpClient.send<void>(`${BackupService.API_BACKUP_ENDPOINT}?to=hive_node`,
				{ "credential": await this.credentialCode.getToken() },
				HttpClient.NO_RESPONSE, HttpMethod.POST);
		} catch (e){
			this.handleError(e);
		}
	}

	public async stopBackup(): Promise<void> {
		return await new Promise<void>((resolve, reject) => {
			reject(new NotImplementedException());
		});
	}

	public async restoreFrom() : Promise<void>{
		try {
			await this.httpClient.send<void>(`${BackupService.API_BACKUP_ENDPOINT}?from=hive_node`,
				{ "credential": await this.credentialCode.getToken() },
				HttpClient.NO_RESPONSE, HttpMethod.POST);
		} catch (e){
			this.handleError(e);
		}
	}

	public async stopRestore(): Promise<void> {
		return await new Promise<void>((resolve, reject) => {
			reject(new NotImplementedException());
		});
	}

	private static getBackupResultStateByStr(value: string): BackupResultState {
	    if (value === 'stop') {
	        return BackupResultState.STATE_STOP;
	    } else if (value === 'backup') {
			return BackupResultState.STATE_BACKUP;
	    } else if (value === 'restore') {
	        return BackupResultState.STATE_RESTORE;
	    } else {
	        throw Error('Unknown state.');
	    }
	}

	private static getBackupResultStatusByStr(value: string): BackupResultResult {
		if (value === 'success') {
			return BackupResultResult.RESULT_SUCCESS;
		} else if (value === 'failed') {
			return BackupResultResult.RESULT_FAILED;
		} else if (value === 'process') {
			return BackupResultResult.RESULT_PROCESS;
		} else {
			throw Error('Unknown result.');
		}
	}

	public async checkResult() : Promise<BackupResult> {
		try {
			return await this.httpClient.send<BackupResult>(BackupService.API_BACKUP_ENDPOINT, HttpClient.NO_PAYLOAD,
					<HttpResponseParser<BackupResult>> {
				deserialize(content: any): BackupResult {
					let json_dict = JSON.parse(content);
					json_dict['state'] = BackupService.getBackupResultStateByStr(json_dict['state']);
					json_dict['result'] = BackupService.getBackupResultStatusByStr(json_dict['result']);
					return Object.assign(new BackupResult(), json_dict);
				}
			}, HttpMethod.GET);
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
