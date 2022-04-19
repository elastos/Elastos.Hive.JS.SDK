import { NodeVersion } from "./nodeversion";
import { NetworkException } from "../../exceptions";
import { HttpClient } from "../../connection/httpclient";
import { HttpMethod } from "../../connection/httpmethod";
import { HttpResponseParser } from "../../connection/httpresponseparser";
import { ServiceContext } from "../../connection/servicecontext";
import { Logger } from '../../utils/logger';
import { RestService } from "../restservice";
import {NodeInfo} from "./nodeinfo";

export class AboutService extends RestService {
	private static LOG = new Logger("AboutService");

	private static API_VERSION_ENDPOINT = "/api/v2/node/version";
	private static API_COMMIT_ENDPOINT = "/api/v2/node/commit_id";
	private static API_INFO_ENDPOINT = "/api/v2/node/info";

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		super(serviceContext, httpClient);
    }

	/**
	 * Get the version of the hive node.
	 *
	 * @return The version of the hive node.
	 */
    public async getNodeVersion(): Promise<NodeVersion> {
		try {
			return await this.httpClient.send<NodeVersion>(AboutService.API_VERSION_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<NodeVersion>>{
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
					return JSON.parse(content)['commit_id'];
				}
			},HttpMethod.GET);
		} catch (e) {
			throw new NetworkException("Error getting node commit id", e);
		}
	}

	/**
	 * Get the information of the hive node.
	 *
	 * @return The information details.
	 * @throws HiveException The exception shows the error from the request.
	 */
	public async getInfo(): Promise<NodeInfo> {
		try {
			return await this.httpClient.send<NodeInfo>(AboutService.API_INFO_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<NodeInfo>>{
				deserialize(content: any): NodeInfo {
					return Object.assign(new NodeInfo(), JSON.parse(content));
				}
			},HttpMethod.GET);
		} catch (e) {
			throw new NetworkException("Error getting node commit id", e);
		}
	}

}