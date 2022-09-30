import { AppContext } from "./connection/auth/appcontext";
import { PromotionService } from "./service/promotion/promotionservice";
import { ServiceEndpoint } from "./connection/serviceendpoint";

export class Backup extends ServiceEndpoint {
    private readonly promotionService: PromotionService;

    public constructor(context: AppContext, providerAddress?: string) {
        super(context, providerAddress);
        this.promotionService  = new PromotionService(this);
    }

    public getPromotionService(): PromotionService  {
        return this.promotionService;
    }
}
