import { BackupContext } from "./backupcontext";

/**
 * This context is for backup the vault data to any other hive node.
 */
export class HiveBackupContext implements BackupContext {
	private readonly targetServiceDid: string;
	private readonly targetProviderAddress: string;

	constructor(serviceDid: string, providerAddress: string) {
		this.targetServiceDid = serviceDid;
		this.targetProviderAddress = providerAddress;
	}

    getAuthorization(srcDid: string, targetDid: string, targetHost: string): Promise<string> {
        return Promise.resolve("");
    }
    
    getType(): string {
        return null;
    }  

	getParameter(parameter: string): string {
		switch (parameter) {
			case "targetAddress":
				return this.targetProviderAddress;

			case "targetServiceDid":
				return this.targetServiceDid

			default:
				break;
		}
		return null;
	}
}
