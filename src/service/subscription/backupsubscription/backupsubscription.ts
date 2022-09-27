import {AppContext} from "../../../connection/auth/appcontext";
import {HttpClient} from "../../../connection/httpclient";
import {ServiceEndpoint} from "../../../connection/serviceendpoint";
import {PaymentService} from "../../payment/paymentservice";
import {SubscriptionService} from "../../subscription/subscriptionservice";
import {PricingPlan} from "../pricingplan";
import {BackupInfo} from "../backupinfo";
import {Order} from "../../payment/order";
import {Receipt} from "../../payment/receipt";

export class BackupSubscription extends ServiceEndpoint {
    private paymentService: PaymentService;
    private subscriptionService: SubscriptionService;

    constructor(context: AppContext, providerAddress?: string) {
		super(context, providerAddress);
        let httpClient = new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
        this.paymentService = new PaymentService(this, httpClient);
        this.subscriptionService = new SubscriptionService(this, httpClient);
	}

	async getPricingPlanList(): Promise<PricingPlan[]> {
        return await this.subscriptionService.getBackupPricingPlanList();
    }

	async getPricingPlan(planName: string): Promise<PricingPlan> {
		return await this.subscriptionService.getBackupPricingPlan(planName);
	}

	async subscribe(): Promise<BackupInfo> {
		return await this.subscriptionService.subscribeToBackup();
	}

	async unsubscribe(): Promise<void> {
		return await this.subscriptionService.unsubscribeBackup();
	}

	async checkSubscription(): Promise<BackupInfo> {
		return await this.subscriptionService.getBackupInfo();
	}

	async placeOrder(planName: string): Promise<Order> {
		return await this.paymentService.placeOrder("backup", planName);
	}

	async getOrder(orderId: number): Promise<Order> {
		return await this.paymentService.getOrder("backup", orderId);
	}

	async settleOrder(orderId: number): Promise<Receipt> {
		return await this.paymentService.settleOrder(orderId);
	}

	async getOrderList(): Promise<Order[]> {
		return await this.paymentService.getOrders("backup");
	}

	async getReceipt(orderId?: number): Promise<Receipt[]> {
		return await this.paymentService.getReceipts(orderId);
	}

	async getVersion(): Promise<string> {
		return await this.paymentService.getVersion();
	}
}