import { BackupContext } from "./backupcontext";

export class HiveBackupContext implements BackupContext {

    public getAuthorization(srcDid: string, targetDid: string, targetHost: string): Promise<string> {
        return Promise.resolve("");
    }
    
    public getType(): string {
        return;
    }  

	public getParameter(parameter: string): string {
		switch (parameter) {
			case "targetAddress":
				return this.getTargetProviderAddress();

			case "targetServiceDid":
				return this.getTargetServiceDid();

			default:
				break;
		}
		return null;
	}

	// /**
	//  * Get the host URL of the backup server.
	//  *
	//  * @return Host URL.
	//  */
	public getTargetProviderAddress(): string {
        return "";
    }
    
	// /**
	//  * Get the service DID of the backup server.
	//  *
	//  * @return The service DID.
	//  */
	public getTargetServiceDid(): string {
        return "";
    }
}
