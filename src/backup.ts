import { AppContext } from "./connection/auth/appcontext";
import { HttpClient } from "./connection/httpclient";
import { PromotionService } from "./service/promotion/promotionservice";
import { ServiceEndpoint } from "./connection/serviceendpoint";

export class Backup extends ServiceEndpoint {
    private readonly promotionService: PromotionService;

    public constructor(context: AppContext, providerAddress?: string) {
        super(context, providerAddress);
        let httpClient = new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
        this.promotionService  = new PromotionService(this, httpClient);
    }

    public getPromotionService(): PromotionService  {
        return this.promotionService;
    }
}
