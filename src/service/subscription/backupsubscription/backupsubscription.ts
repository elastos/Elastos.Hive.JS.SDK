import { AppContext } from "../../../connection/auth/appcontext";
import { HttpClient } from "../../../connection/httpclient";
import { ServiceEndpoint } from "../../../connection/serviceendpoint";
import { Logger } from '../../../utils/logger';
import { PaymentService } from "../../payment/paymentservice";
import { SubscriptionService } from "../../subscription/subscriptionservice";
import { PricingPlan } from "../pricingplan";
import { BackupInfo } from "../backupinfo";
import { Order } from "../../payment/order";
import { Receipt } from "../../payment/receipt";

export class BackupSubscription extends ServiceEndpoint {
	private static LOG = new Logger("BackupSubscriptionService");

    private paymentService: PaymentService;
    private subscriptionService: SubscriptionService;

    public constructor(context: AppContext, providerAddress?: string) {
		super(context, providerAddress);
        let httpClient = new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
        this.paymentService = new PaymentService(this, httpClient);
        this.subscriptionService = new SubscriptionService(this, httpClient);
	}

	public async getPricingPlanList(): Promise<PricingPlan[]> {
        return await this.subscriptionService.getBackupPricingPlanList();
    }

	public async getPricingPlan(planName: string): Promise<PricingPlan> {
		return await this.subscriptionService.getBackupPricingPlan(planName);
	}

	public async subscribe(): Promise<BackupInfo> {
		return await this.subscriptionService.subscribeToBackup();
	}

	public async unsubscribe(): Promise<void> {
		return await this.subscriptionService.unsubscribeBackup();
	}

	public async checkSubscription(): Promise<BackupInfo> {
		return await this.subscriptionService.getBackupInfo();
	}

	public async placeOrder(planName: string): Promise<Order> {
		return await this.paymentService.placeOrder("backup", planName);
	}

	public async getOrder(orderId: number): Promise<Order> {
		return await this.paymentService.getOrder("backup", orderId);
	}

	public async settleOrder(orderId: number): Promise<Receipt> {
		return await this.paymentService.settleOrder(orderId);
	}

	public async getOrderList(): Promise<Order[]> {
		return await this.paymentService.getOrders("backup");
	}

	public async getReceipt(orderId?: number): Promise<Receipt[]> {
		return await this.paymentService.getReceipts(orderId);
	}

	public async getVersion(): Promise<string> {
		return await this.paymentService.getVersion();
	}
}