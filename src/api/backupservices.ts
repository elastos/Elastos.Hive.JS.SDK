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
		let httpClient = new HttpClient(this, HttpClient.DEFAULT_OPTIONS)
		this.promotionService  = new PromotionService(this, httpClient);
	}

	public getPromotionService(): PromotionService  {
		return this.promotionService;
	}
}
