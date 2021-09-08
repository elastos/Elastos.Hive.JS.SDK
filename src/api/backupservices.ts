import { HttpClient } from "../http/httpclient";
import { AppContext } from "../http/security/appcontext";
import { PromotionService } from "../restclient/promotion/promotionservice";
import { ServiceContext } from "../http/servicecontext";

/**
 * This class explicitly represents the vault service subscribed by "userDid".
 */
 export class BackupServices extends ServiceContext {
	private promotionService: PromotionService;

	public constructor(context: AppContext, providerAddress: string) {
		super(context, providerAddress);
		this.promotionService  = new PromotionService(this, new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS));
	}

	public getPromotionService(): PromotionService  {
		return this.promotionService;
	}
}
