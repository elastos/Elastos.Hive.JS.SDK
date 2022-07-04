import {NodeRPCException, NotImplementedException} from "../../exceptions";
import { ServiceEndpoint } from "../../connection/serviceendpoint";
import { BackupContext } from "./backupcontext";
import { CodeFetcher } from "../../connection/auth/codefetcher";


export class RemoteResolver implements CodeFetcher {
    private readonly targetDid: string;
    private readonly targetHost: string;
    private serviceContext: ServiceEndpoint;
    private backupContext: BackupContext;

	constructor(serviceEndpoint: ServiceEndpoint, backupContext: BackupContext,
				targetServiceDid: string, targetAddress: string) {
		this.serviceContext = serviceEndpoint;
		this.backupContext = backupContext;
		this.targetDid = targetServiceDid;
		this.targetHost = targetAddress;
	}

	async fetch(): Promise<string> {
		if (this.serviceContext.getServiceInstanceDid() == null) {
			await this.serviceContext.refreshAccessToken();
		}
		try {
			return await this.backupContext.getAuthorization(this.serviceContext.getServiceInstanceDid(), this.targetDid, this.targetHost);
		} catch (e) {  //InterruptedException | ExecutionException 
			throw new NodeRPCException(NodeRPCException.UNAUTHORIZED, -1,
					"Failed to create backup credential." + e.toString());
		}
	}

	invalidate(): Promise<void> {
        throw new NotImplementedException();
    }
}


