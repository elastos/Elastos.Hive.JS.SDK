import {HttpClient} from "../../connection/httpclient";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {RestServiceT} from "../restservice";
import {PromotionAPI} from "./promotionapi";

export class PromotionService extends RestServiceT<PromotionAPI> {
    constructor(serviceContext: ServiceEndpoint, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}

	async promote(): Promise<void> {
        await this.callAPI(PromotionAPI, async api => {
            return await api.promoteToVault(await this.getAccessToken());
        });
	}
}
