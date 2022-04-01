import { ServiceContext } from "../../connection/servicecontext";
import { CodeFetcher } from "../../connection/auth/codefetcher";


export class LocalResolver implements CodeFetcher {
	private serviceContext: ServiceContext;
	private nextResolver: CodeFetcher;

	constructor(serviceContext: ServiceContext, next: CodeFetcher) {
		this.serviceContext = serviceContext;
		this.nextResolver = next;
	}

	public async fetch(): Promise<string> {
		let token = this.restoreToken();
		if (token == null) {
			token = await this.nextResolver.fetch();
			this.saveToken(token);
		}

		return token;
	}

	public  invalidate(): void {
		this.clearToken();
	}

	private  restoreToken(): string {
		let storage = this.serviceContext.getStorage();

		if (this.serviceContext.getServiceInstanceDid() == null)
			return null;

		return storage.loadBackupCredential(this.serviceContext.getServiceInstanceDid());
	}

	private saveToken(token: string): void {
		let storage = this.serviceContext.getStorage();

		if (this.serviceContext.getServiceInstanceDid() != null)
			storage.storeBackupCredential(this.serviceContext.getServiceInstanceDid(), token);
	}

	private clearToken(): void {
		let storage = this.serviceContext.getStorage();

		if (this.serviceContext.getServiceInstanceDid() != null)
			storage.clearBackupCredential(this.serviceContext.getServiceInstanceDid());
	}
}
