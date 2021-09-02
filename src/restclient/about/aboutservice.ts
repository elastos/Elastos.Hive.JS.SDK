import { NodeVersion } from "../../domain/nodeversion";
import { NetworkException } from "../../exceptions";
import { HttpClient } from "../../http/httpclient";
import { AppContextProvider } from "../../http/security/appcontextprovider";
import { ServiceContext } from "../../http/servicecontext";

export class AboutService {

	private httpClient: HttpClient;
	private serviceContext: ServiceContext;
	private contextProvider: AppContextProvider;

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		this.serviceContext = serviceContext;
		this.httpClient = httpClient;
		this.contextProvider = serviceContext.getAppContext().getAppContextProvider();
    }

    public getNodeVersion(): NodeVersion {
		try {
			return aboutAPI.version().execute().body();
		} catch (e) {
			throw new NetworkException(e);
		}
	}

	/**
	 * Get the commit id of the github of the hive node.
	 *
	 * @return The commit id.
	 * @throws HiveException The exception shows the error from the request.
	 */
	public getCommitId(): string {
		try {
			return aboutAPI.commitId().execute().body().getCommitId();
		} catch (e) {
			throw new NetworkException(e);
		}
	}

}