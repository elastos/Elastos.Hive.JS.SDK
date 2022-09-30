import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {RestServiceT} from "../restservice";
import {Order} from "./order";
import {Receipt} from "./receipt";
import {checkNotNull} from "../../utils/utils";
import {IllegalArgumentException, NotImplementedException} from "../../exceptions";
import {PaymentAPI} from "./paymentapi";

export class PaymentService extends RestServiceT<PaymentAPI> {
    constructor(serviceContext: ServiceEndpoint) {
		super(serviceContext);
	}

	/**
	 * This is for creating the payment order which upgrades the pricing plan of the vault or the backup.
	 *
	 * @param subscription The value is "vault" or "backup".
	 * @param pricingName The pricing plan name.
	 * @return The details of the order.
	 * @throws HiveException The error comes from the hive node.
	 */
	 async placeOrder(subscription: string, pricingName: string): Promise<Order> {
		checkNotNull(subscription, "Missing subscription.");
		checkNotNull(pricingName, "Missing pricing name.");

        return await this.callAPI(PaymentAPI, async api => {
            return await api.placeOrder(await this.getAccessToken(), {
                "subscription": subscription,
                "pricing_name": pricingName
            });
        });
	}

    /**
     * Pay order with smart contract by wallet application.
     */
	async payOrder(): Promise<number> {
        return await new Promise<number>((resolve, reject) => {
            reject(new NotImplementedException('Please use payment SDK.'));
        });
    }

	/**
	 * Settle the order by the contract order id.
	 *
	 * @param orderId The order id from paying order.
	 */
	async settleOrder(orderId: number): Promise<Receipt> {
		checkNotNull(orderId, "Missing order id.");

        return await this.callAPI(PaymentAPI, async api => {
            return await api.settleOrder(await this.getAccessToken(), orderId);
        });
	}

	/**
	 * Get the order information by the order id.
	 *
	 * @param subscription vault/backup
	 * @param orderId The contract order id.
	 * @return The details of the order.
	 * @throws HiveException The error comes from the hive node.
	 */
	async getOrder(subscription: string, orderId: number): Promise<Order> {
		checkNotNull(subscription, "Missing subscription.");
		checkNotNull(orderId, "Missing order id.");

		if (subscription != "vault" && subscription != "backup") {
			throw new IllegalArgumentException("Invalid subscription. Must be 'vault' or 'backup'");
		}

		const orders =  await this.getOrdersInternal(subscription, orderId);
        return !orders ? null : orders[0];
	}

	/**
	 * Get the orders by the subscription type.
	 *
	 * @param subscription The value is "vault" or "backup".
	 * @return The order list, MUST not empty.
	 * @throws HiveException The error comes from the hive node.
	 */
	async getOrders(subscription: string): Promise<Order[]> {
		checkNotNull(subscription, "Missing subscription.");

        if (subscription != "vault" && subscription != "backup") {
            throw new IllegalArgumentException("Invalid subscription. Must be 'vault' or 'backup'");
        }

		return await this.getOrdersInternal(subscription);
	}

	private async getOrdersInternal(subscription: string, orderId?: number): Promise<Order[]> {
        return await this.callAPI(PaymentAPI, async api => {
            return await api.getOrders(await this.getAccessToken(), {
                "subscription": subscription,
                "order_id": orderId
            });
        });
	}

	/**
	 * Get the receipt by the order id.
	 *
	 * @param orderId The order id.
	 * @return The details of the receipt.
	 * @throws HiveException The error comes from the hive node.
	 */
	async getReceipts(orderId?: number): Promise<Receipt[]> {
        return await this.callAPI(PaymentAPI, async api => {
            return await api.getReceipts(await this.getAccessToken(), {"order_id": orderId});
        });
	}

	/**
	 * Get the version of the payment module.
	 *
	 * @return The version.
	 * @throws HiveException The error comes from the hive node.
	 */
	async getVersion(): Promise<string> {
        return await this.callAPI(PaymentAPI, async api => {
            return await api.version(await this.getAccessToken());
        });
	}
}
