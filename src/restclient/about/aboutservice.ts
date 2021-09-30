import { NodeVersion } from "../../domain/nodeversion";
import { NetworkException } from "../../exceptions";
import { HttpClient } from "../../http/httpclient";
import { HttpMethod } from "../../http/httpmethod";
import { HttpResponseParser } from "../../http/httpresponseparser";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';
import { RestService } from "../restservice";

export class AboutService extends RestService {
	private static LOG = new Logger("AboutService");

	private static API_ABOUT_ENDPOINT = "/api/v2/about/version";
	private static API_COMMIT_ENDPOINT = "/api/v2/about/commit_id";

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		super(serviceContext, httpClient);
    }

    public async getNodeVersion(): Promise<NodeVersion> {
		try {
			return await this.httpClient.send<NodeVersion>(AboutService.API_ABOUT_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<NodeVersion>>{
				deserialize(content: any): NodeVersion {
					let jsonObj = JSON.parse(content);
					return new NodeVersion(jsonObj['major'], jsonObj['minor'], jsonObj['patch']);
				}
			},HttpMethod.GET);
		}
		catch (e) {
			throw new NetworkException("Error getting node version", e);
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
			return await this.httpClient.send<string>(AboutService.API_COMMIT_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<string>>{
				deserialize(content: any): string {
					return JSON.parse(content)['commit_hash'];
				}
			},HttpMethod.GET);
		} catch (e) {
			throw new NetworkException("Error getting node commit id", e);
		}
	}

}