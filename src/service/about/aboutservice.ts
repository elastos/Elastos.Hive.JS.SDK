import {NodeVersion} from "./nodeversion";
import {HiveException, NetworkException} from "../../exceptions";
import {HttpClient} from "../../connection/httpclient";
import {HttpResponseParser} from "../../connection/httpresponseparser";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {APIResponse, RestServiceT} from "../restservice";
import {NodeInfo} from "./nodeinfo";
import {VerifiablePresentation} from "@elastosfoundation/did-js-sdk";
import {AboutAPI} from "./aboutapi";

export class AboutService extends RestServiceT<AboutAPI> {
    constructor(serviceContext: ServiceEndpoint, httpClient: HttpClient) {
		super(serviceContext, httpClient);
    }

	/**
	 * Get the version of the hive node.
	 *
	 * @return The version of the hive node.
	 */
    async getNodeVersion(): Promise<NodeVersion> {
		try {
            const response = await (await this.getAPI<AboutAPI>(AboutAPI)).version();
            return new APIResponse<NodeVersion>(response).get(<HttpResponseParser<NodeVersion>>{
                	deserialize(jsonObj: any): NodeVersion {
                		return new NodeVersion(jsonObj['major'], jsonObj['minor'], jsonObj['patch']);
                	}});
		} catch (e) {
			throw new NetworkException(e.message, e);
		}
	}

	/**
	 * Get the commit id of the github of the hive node.
	 *
	 * @return The commit id.
	 * @throws HiveException The exception shows the error from the request.
	 */
	async getCommitId(): Promise<string> {
		try {
            const response = await (await this.getAPI<AboutAPI>(AboutAPI)).commitId();
            return new APIResponse<string>(response).get(<HttpResponseParser<string>>{
                    deserialize(jsonObj: any): string {
                        return jsonObj['commit_id'];
                    }});
		} catch (e) {
			throw new NetworkException(e.message, e);
		}
	}

	/**
	 * Get the information of the hive node.
	 *
	 * @return The information details.
	 * @throws HiveException The exception shows the error from the request.
	 */
	async getInfo(): Promise<NodeInfo> {
		try {
            const response = await (await this.getAPI<AboutAPI>(AboutAPI)).info(await this.getAccessToken());
            return new APIResponse<NodeInfo>(response).get(<HttpResponseParser<NodeInfo>>{
                deserialize(jsonObj: any): NodeInfo {
                    jsonObj['ownership_presentation'] = VerifiablePresentation.parse(JSON.stringify(jsonObj['ownership_presentation']));
                    return Object.assign(new NodeInfo(), jsonObj);
                }});
		} catch (e) {
            await this.handleResponseError(e);
		}
	}

}