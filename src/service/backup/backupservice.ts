import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {NotImplementedException} from "../../exceptions";
import {RestServiceT} from "../restservice";
import {BackupResult, BackupResultResult} from "./backupresult";
import {CredentialCode} from "./credentialcode";
import {BackupContext} from "./backupcontext";
import {BackupAPI} from "./backupapi";

/**
 * The backup service is to backup the vault data to any other hive node.
 */
export class BackupService extends RestServiceT<BackupAPI> {
	private credentialCode: CredentialCode;

    constructor(serviceContext: ServiceEndpoint) {
		super(serviceContext);
	}

    /**
     * Setup the backup context which provides info. from user for the backup process.
     *
     * @param backupContext The backup context.
     */
	setBackupContext(backupContext: BackupContext) {
		this.credentialCode = new CredentialCode(this.getServiceContext(), backupContext);
	}

    /**
     * Start backup and wait until finish.
     *
     * @param callback (state: BackupResultResult, message: string, e: HiveException) => {}
     *                 If 'process', the message is the percent progress, and it will be called many times.
     */
    async startBackup(callback?): Promise<void> {
        await this.callAPI(BackupAPI, async api => {
            return await api.saveToNode(await this.getAccessToken(),
                                  {"credential": await this.credentialCode.getToken()});
        });

        await this.waitByCheckResult(callback);
    }

	private async waitByCheckResult(callback?): Promise<void> {
        const sleep = (waitTimeInMs) => new Promise(resolve => {
            setTimeout(resolve, waitTimeInMs);
        });

        let result = null;
        do {
            result = await this.checkResult();

            if (callback) {
                callback(result.getResult(), result.getMessage());
            }

            await sleep(1000);

        } while (result.getResult() == BackupResultResult.RESULT_PROCESS);
    }

    /**
     * Stop the backup process.
     *
     * To be implemented.
     */
	async stopBackup(): Promise<void> {
		return await new Promise<void>((resolve, reject) => {
			reject(new NotImplementedException());
		});
	}

    /**
     * Start restore and wait until finish.
     *
     * @param callback :(state: BackupResultResult, message: string, e: HiveException)
     *                 If 'process', the message is the percent progress, and it will be called many times.
     *
     */
	async restoreFrom(callback?) : Promise<void>{
        await this.callAPI(BackupAPI, async api => {
            return await api.restoreFromNode(await this.getAccessToken(),
                                       {"credential": await this.credentialCode.getToken()});
        });

        await this.waitByCheckResult(callback);
	}

    /**
     * Stop the restore process.
     *
     * To be implemented.
     */
	async stopRestore(): Promise<void> {
		return await new Promise<void>((resolve, reject) => {
			reject(new NotImplementedException());
		});
	}

    /**
     * Check the result of backup or restore action.
     *
     * @return The result of backup or restore action.
     */
	async checkResult() : Promise<BackupResult> {
        return await this.callAPI(BackupAPI, async api => {
            return await api.getState(await this.getAccessToken());
        });
	}
}
