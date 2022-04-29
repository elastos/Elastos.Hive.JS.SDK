import { AppContext } from "../../../connection/auth/appcontext";
import { HttpClient } from "../../../connection/httpclient";
import { ServiceEndpoint } from "../../../connection/serviceendpoint";
import { Logger } from '../../../utils/logger';
import { PaymentService } from "../../payment/paymentservice";
import { SubscriptionService } from "../../subscription/subscriptionservice";
import { PricingPlan } from "../pricingplan";
import { VaultInfo } from "../vaultinfo";
import { Receipt } from "../../payment/receipt";
import { Order } from "../../payment/order";
import {AppInfo} from "../appinfo";

export class VaultSubscription extends ServiceEndpoint {
	private static LOG = new Logger("VaultSubscription");

    private paymentService: PaymentService;
    private subscriptionService: SubscriptionService;

    public constructor(context: AppContext, providerAddress?: string) {
		super(context, providerAddress);
        let httpClient = new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
        this.paymentService = new PaymentService(this, httpClient);
        this.subscriptionService = new SubscriptionService(this, httpClient);
	}

	public async getPricingPlanList(): Promise<PricingPlan[]> {
		return await this.subscriptionService.getVaultPricingPlanList();
	}

	public async getPricingPlan(planName: string): Promise<PricingPlan> {
		return await this.subscriptionService.getVaultPricingPlan(planName);
	}

	public async subscribe(): Promise<VaultInfo> {
		return await this.subscriptionService.subscribeToVault();
	}

	public async unsubscribe(): Promise<void> {
		return await this.subscriptionService.unsubscribeVault();
	}

	public async checkSubscription(): Promise<VaultInfo> {
		return await this.subscriptionService.getVaultInfo();
	}

	public async getAppStats(): Promise<AppInfo[]> {
		return await this.subscriptionService.getAppStats();
	}

	public async placeOrder(planName: string): Promise<Order> {
		return await this.paymentService.placeOrder("vault", planName);
	}

	public async getOrder(orderId: string): Promise<Order> {
		return await this.paymentService.getOrder("vault", orderId);
	}

	public async payOrder(orderId: string, transactionId: string): Promise<Receipt> {
		return await this.paymentService.payOrder(orderId, transactionId);
	}

	public async getOrderList(): Promise<Order[]> {
		return await this.paymentService.getOrders("vault");
	}

	public async getReceipt(orderId: string): Promise<Receipt> {
		return await this.paymentService.getReceipt(orderId);
	}

	public async getVersion(): Promise<string> {
		return await this.paymentService.getVersion();
	}
}