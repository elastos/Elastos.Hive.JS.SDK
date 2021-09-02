import { NodeVersion } from "../../domain/nodeversion";
import { NetworkException } from "../../exceptions";
import { HttpClient } from "../../http/httpclient";
import { HttpMethod } from "../../http/httpmethod";
import { HttpResponseParser } from "../../http/httpresponseparser";
import { AppContextProvider } from "../../http/security/appcontextprovider";
import { ServiceContext } from "../../http/servicecontext";

export class AboutService {

	private static API_ABOUT_ENDPOINT = "/api/v2/about/version";
	private static API_COMMIT_ENDPOINT = "/api/v2/about/commit_id";

	private httpClient: HttpClient;
	private serviceContext: ServiceContext;
	private contextProvider: AppContextProvider;

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		this.serviceContext = serviceContext;
		this.httpClient = httpClient;
		this.contextProvider = serviceContext.getAppContext().getAppContextProvider();
    }

    public async getNodeVersion(): Promise<NodeVersion> {
		try {
			return await this.httpClient.send<NodeVersion>(AboutService.API_ABOUT_ENDPOINT, {}, <HttpResponseParser<NodeVersion>>{
				deserialize(content: any): NodeVersion {
					let jsonObj = JSON.parse(content);
					return new NodeVersion(jsonObj['major'], jsonObj['minor'], jsonObj['patch']);
				}
			},HttpMethod.GET);
		}
		catch (e) {
			throw new NetworkException(e);
		}
	}

	/**
	 * Get the commit id of the github of the hive node.
	 *
	 * @return The commit id.
	 * @throws HiveException The exception shows the error from the request.
	 */
	public async getCommitId(): Promise<string> {
		try {
			return await this.httpClient.send<string>(AboutService.API_COMMIT_ENDPOINT, {}, <HttpResponseParser<string>>{
				deserialize(content: any): string {
					return JSON.parse(content)['commit_hash'];
				}
			},HttpMethod.GET);
		} catch (e) {
			throw new NetworkException(e);
		}
	}

}