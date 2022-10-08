import {AppContext} from "../../../connection/auth/appcontext";
import {ServiceEndpoint} from "../../../connection/serviceendpoint";
import {PaymentService} from "../../payment/paymentservice";
import {SubscriptionService} from "../../subscription/subscriptionservice";
import {PricingPlan} from "../pricingplan";
import {VaultInfo} from "../vaultinfo";
import {Receipt} from "../../payment/receipt";
import {Order} from "../../payment/order";
import {AppInfo} from "../appinfo";

export class VaultSubscription extends ServiceEndpoint {
    private paymentService: PaymentService;
    private subscriptionService: SubscriptionService;

    constructor(context: AppContext, providerAddress?: string) {
        super(context, providerAddress);
        this.paymentService = new PaymentService(this);
        this.subscriptionService = new SubscriptionService(this);
    }

    async getPricingPlanList(): Promise<PricingPlan[]> {
        return await this.subscriptionService.getVaultPricingPlanList();
    }

    async getPricingPlan(planName: string): Promise<PricingPlan> {
        return await this.subscriptionService.getVaultPricingPlan(planName);
    }

    async subscribe(): Promise<VaultInfo> {
        return await this.subscriptionService.subscribeToVault();
    }

    async activate(): Promise<void> {
        return await this.subscriptionService.activateVault();
    }

    async deactivate(): Promise<void> {
        return await this.subscriptionService.deactivateVault();
    }

    async checkSubscription(): Promise<VaultInfo> {
        return await this.subscriptionService.getVaultInfo();
    }

    async getAppStats(): Promise<AppInfo[]> {
        return await this.subscriptionService.getAppStats();
    }

    async unsubscribe(): Promise<void> {
        return await this.subscriptionService.unsubscribeVault();
    }

    async placeOrder(planName: string): Promise<Order> {
        return await this.paymentService.placeOrder("vault", planName);
    }

    async getOrder(orderId: number): Promise<Order> {
        return await this.paymentService.getOrder("vault", orderId);
    }

    async settleOrder(orderId: number): Promise<Receipt> {
        return await this.paymentService.settleOrder(orderId);
    }

    async getOrderList(): Promise<Order[]> {
        return await this.paymentService.getOrders("vault");
    }

    async getReceipts(orderId?: number): Promise<Receipt[]> {
        return await this.paymentService.getReceipts(orderId);
    }

    async getVersion(): Promise<string> {
        return await this.paymentService.getVersion();
    }
}