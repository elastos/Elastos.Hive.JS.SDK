import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {HiveException} from "../../exceptions";
import {RestServiceT} from "../restservice";
import {AboutAPI} from "./aboutapi";
import {NodeVersion} from "./nodeversion";
import {NodeInfo} from "./nodeinfo";

/**
 * The about service is to show some information of the hive node.
 */
export class AboutService extends RestServiceT<AboutAPI> {
    constructor(serviceContext: ServiceEndpoint) {
		super(serviceContext);
    }

	/**
	 * Get the version of the hive node.
	 *
	 * @return The version of the hive node.
	 */
    async getNodeVersion(): Promise<NodeVersion> {
        return await this.callAPI(AboutAPI, async (api) => {
            return await api.version();
        });
	}

	/**
	 * Get the commit id of the github of the hive node.
	 *
	 * @return The commit id.
	 * @throws HiveException The exception shows the error from the request.
	 */
	async getCommitId(): Promise<string> {
        return await this.callAPI(AboutAPI, async (api) => {
            return await api.commitId();
        });
	}

	/**
	 * Get the information of the hive node.
	 *
	 * @return The information details.
	 * @throws HiveException The exception shows the error from the request.
	 */
	async getInfo(): Promise<NodeInfo> {
        return await this.callAPI(AboutAPI, async (api) => {
            return await api.info(await this.getAccessToken());
        });
	}
}
