import {NodeVersion} from "./nodeversion";
import {HiveException, NetworkException} from "../../exceptions";
import {HttpClient} from "../../connection/httpclient";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {RestServiceT} from "../restservice";
import {NodeInfo} from "./nodeinfo";
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
            return await this.callAPI(AboutAPI, async (api) => {
                return await api.version();
            });
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
            return await this.callAPI(AboutAPI, async (api) => {
                return await api.commitId();
            });
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
            return await this.callAPI(AboutAPI, async (api) => {
                return await api.info(await this.getAccessToken());
            });
		} catch (e) {
            await this.handleResponseError(e);
		}
	}

}