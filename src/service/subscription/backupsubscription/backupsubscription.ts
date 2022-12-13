import {AppContext} from "../../../connection/auth/appcontext";
import {ServiceEndpoint} from "../../../connection/serviceendpoint";
import {PaymentService} from "../../payment/paymentservice";
import {SubscriptionService} from "../../subscription/subscriptionservice";
import {Order} from "../../payment/order";
import {Receipt} from "../../payment/receipt";
import {PricingPlan} from "../pricingplan";
import {BackupInfo} from "../backupinfo";

/**
 * The backup subscription is for the backup node to operate the backup service.
 */
export class BackupSubscription extends ServiceEndpoint {
    private paymentService: PaymentService;
    private subscriptionService: SubscriptionService;

    constructor(context: AppContext, providerAddress?: string) {
        super(context, providerAddress);
        this.paymentService = new PaymentService(this);
        this.subscriptionService = new SubscriptionService(this);
    }

    /**
     * Get the pricing plan list of the backup service which can be used for upgrading the service.
     *
     * @return The price plan list.
     * @throws HiveException The error comes from the hive node.
     */
    async getPricingPlanList(): Promise<PricingPlan[]> {
        return await this.subscriptionService.getBackupPricingPlanList();
    }

    /**
     * Get the pricing plan for the backup by name.
     *
     * @param planName The name of the pricing plan.
     * @return The pricing plan
     * @throws HiveException The error comes from the hive node.
     */
    async getPricingPlan(planName: string): Promise<PricingPlan> {
        return await this.subscriptionService.getBackupPricingPlan(planName);
    }

    /**
     * Subscribe the backup service with the free pricing plan.
     *
     * @return The details of the new created backup service.
     * @throws HiveException The error comes from the hive node.
     */
    async subscribe(): Promise<BackupInfo> {
        return await this.subscriptionService.subscribeToBackup();
    }

    /**
     * Get the details of the backup service.
     *
     * @return The details of the backup service.
     * @throws HiveException The error comes from the hive node.
     */
    async checkSubscription(): Promise<BackupInfo> {
        return await this.subscriptionService.getBackupInfo();
    }

    /**
     * Unsubscribe the backup service.
     *
     * @throws HiveException The error comes from the hive node.
     */
    async unsubscribe(): Promise<void> {
        return await this.subscriptionService.unsubscribeBackup();
    }

    /**
     * This is for creating the payment order which upgrades the pricing plan of the backup.
     *
     * @param pricingName The pricing plan name.
     * @return The details of the order.
     * @throws HiveException The error comes from the hive node.
     */
    async placeOrder(pricingName: string): Promise<Order> {
        return await this.paymentService.placeOrder("backup", pricingName);
    }

    /**
     * Get the order information by the order id.
     *
     * @param orderId The contract order id.
     * @return The details of the order.
     * @throws HiveException The error comes from the hive node.
     */
    async getOrder(orderId: number): Promise<Order> {
        return await this.paymentService.getOrder("backup", orderId);
    }

    /**
     * Settle the order by the contract order id.
     *
     * @param orderId The order id from paying order.
     */
    async settleOrder(orderId: number): Promise<Receipt> {
        return await this.paymentService.settleOrder(orderId);
    }

    /**
     * Get the orders by the backup subscription.
     *
     * @return The order list, MUST not empty.
     * @throws HiveException The error comes from the hive node.
     */
    async getOrders(): Promise<Order[]> {
        return await this.paymentService.getOrders("backup");
    }

    /**
     * Get the receipt by the order id.
     *
     * @param orderId The order id.
     * @return The details of the receipt.
     * @throws HiveException The error comes from the hive node.
     */
    async getReceipts(orderId?: number): Promise<Receipt[]> {
        return await this.paymentService.getReceipts(orderId);
    }

    /**
     * Get the version of the payment module.
     *
     * @return The version.
     * @throws HiveException The error comes from the hive node.
     */
    async getVersion(): Promise<string> {
        return await this.paymentService.getVersion();
    }
}
