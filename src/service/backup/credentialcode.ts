import { BackupContext } from "./backupcontext";
import { CodeFetcher } from "../../connection/auth/codefetcher";
import { LocalResolver } from "./localresolver";
import { RemoteResolver } from "./remoteresolver";
import { ServiceEndpoint } from "../../connection/serviceendpoint";

/**
 * Used to fetch backup credential and keep it in local storage.
 */
export class CredentialCode {
    private readonly endpoint: ServiceEndpoint;
    private credentialFetcher: CodeFetcher;
	private jwtCode: string;

    constructor(endpoint: ServiceEndpoint, context: BackupContext) {
        this.endpoint = endpoint;
        const remoteResolver = new RemoteResolver(
        		endpoint, context,
                context.getParameter("targetServiceDid"),
                context.getParameter("targetAddress"));
		this.credentialFetcher = new LocalResolver(endpoint, context, remoteResolver);
    }

    async getToken(): Promise<string> {
		if (this.jwtCode != null)
			return this.jwtCode;

        this.jwtCode = await this.credentialFetcher.fetch();
		return this.jwtCode;
	}
}
