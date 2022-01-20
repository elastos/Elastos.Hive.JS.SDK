import { NodeRPCException } from "../../exceptions";
import { ServiceContext } from "../../http/servicecontext";
import { BackupContext } from "./backupcontext";
import { CodeFetcher } from "./codefetcher";


export class RemoteResolver implements CodeFetcher {
	private serviceContext: ServiceContext;
	private backupContext: BackupContext;
	private targetDid: string;
	private targetHost: string;

	constructor( serviceEndpoint: ServiceContext, backupContext: BackupContext,
						   targetServiceDid: string, targetAddress: string) {
		this.serviceContext = serviceEndpoint;
		this.backupContext = backupContext;
		this.targetDid = targetServiceDid;
		this.targetHost = targetAddress;
	}

	public async fetch(): Promise<string> {
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


	public invalidate(): void {

    }
}


