import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {RestServiceT} from "../restservice";
import {PromotionAPI} from "./promotionapi";

/**
 * The promotion service is on the backup node side and used for promoting the backup data to the vault.
 */
export class PromotionService extends RestServiceT<PromotionAPI> {
    constructor(serviceContext: ServiceEndpoint) {
		super(serviceContext);
	}

    /**
     * Promote the data on the backup node to a new vault.
     * After doing this, user should change the vault node binding with his DID.
     */
	async promote(): Promise<void> {
        await this.callAPI(PromotionAPI, async api => {
            return await api.promoteToVault(await this.getAccessToken());
        });
	}
}
