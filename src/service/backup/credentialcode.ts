import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {CodeFetcher} from "../../connection/auth/codefetcher";
import {BackupContext} from "./backupcontext";
import {LocalResolver} from "./localresolver";
import {RemoteResolver} from "./remoteresolver";

/**
 * Used to fetch backup credential and keep it in local storage.
 *
 * Internal class.
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

    /**
     * Get the credential which represents the user to execute the backup action.
     *
     * @return The credential issued by the user.
     */
    async getToken(): Promise<string> {
		if (this.jwtCode != null)
			return this.jwtCode;

        this.jwtCode = await this.credentialFetcher.fetch();
		return this.jwtCode;
	}
}
