import { HttpClient } from "../../http/httpclient";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';
import { PaymentService } from "../payment/paymentservice";
import { RestService } from "../restservice";
import { SubscriptionService } from "../subscription/subscriptionservice";

export class BackupSubscriptionService extends RestService {
	private static LOG = new Logger("BackupSubscriptionService");

    private paymentService: PaymentService;
    private subscriptionService: SubscriptionService;

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		super(serviceContext, httpClient);
        this.paymentService = new PaymentService(serviceContext, httpClient);
        this.subscriptionService = new PaymentService(serviceContext, httpClient);
	}

	public isAuthorizationRequired(): boolean {
        return true;
    }
}