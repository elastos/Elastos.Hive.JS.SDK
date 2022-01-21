import { AppContext } from "../../../http/auth/appcontext";
import { HttpClient } from "../../../http/httpclient";
import { ServiceContext } from "../../../http/servicecontext";
import { Logger } from '../../../logger';
import { PaymentService } from "../../payment/paymentservice";
import { SubscriptionService } from "../../subscription/subscriptionservice";
import { PricingPlan } from "../../../domain/subscription/pricingplan";
import { BackupInfo } from "../../../domain/subscription/backupinfo";
import { Order } from "../../../domain/payment/order";
import { Receipt } from "../../../domain/payment/receipt";

export class BackupSubscriptionService extends ServiceContext {
	private static LOG = new Logger("BackupSubscriptionService");

    private paymentService: PaymentService;
    private subscriptionService: SubscriptionService;

    public constructor(context: AppContext, providerAddress: string) {
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

	public async getOrder(orderId: string): Promise<Order> {
		return await this.paymentService.getOrder("backup", orderId);
	}

	public async payOrder(orderId: string, transactionId: string): Promise<Receipt> {
		return await this.paymentService.payOrder(orderId, transactionId);
	}

	public async getOrderList(): Promise<Order[]> {
		return await this.paymentService.getOrders("backup");
	}

	public async getReceipt(orderId: string): Promise<Receipt> {
		return await this.paymentService.getReceipt(orderId);
	}

	public async getVersion(): Promise<string> {
		return await this.paymentService.getVersion();
	}
}