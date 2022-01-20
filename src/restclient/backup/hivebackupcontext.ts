import { BackupContext } from "./backupcontext";

export class HiveBackupContext implements BackupContext {
	private readonly targetServiceDid: string;
	private readonly targetProviderAddress: string;

	constructor(serviceDid: string, providerAddress: string) {
		this.targetServiceDid = serviceDid;
		this.targetProviderAddress = providerAddress;
	}

    public getAuthorization(srcDid: string, targetDid: string, targetHost: string): Promise<string> {
        return Promise.resolve("");
    }
    
    public getType(): string {
        return null;
    }  

	public getParameter(parameter: string): string {
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
