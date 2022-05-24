import { HttpClient } from "../../connection/httpclient";
import { ServiceEndpoint } from "../../connection/serviceendpoint";
import { Logger } from '../../utils/logger';
import { RestService } from "../restservice";
import { Order } from  "./order";
import { Receipt } from  "./receipt";
import { checkNotNull } from "../../utils/utils";
import { HttpMethod } from "../../connection/httpmethod";
import {IllegalArgumentException, NotImplementedException} from "../../exceptions";
import { HttpResponseParser } from "../../connection/httpresponseparser";
import { NetworkException, NodeRPCException } from "../../exceptions";

export class PaymentService extends RestService {
	private static LOG = new Logger("PaymentService");

	private static API_ORDER_ENDPOINT = "/api/v2/payment/order";
	private static API_RECEIPT_ENDPOINT = "/api/v2/payment/receipt";
	private static API_VERSION_ENDPOINT = "/api/v2/payment/version";

    constructor(serviceContext: ServiceEndpoint, httpClient: HttpClient) {
		super(serviceContext, httpClient);
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

		try {
			return await this.httpClient.send<Order>(PaymentService.API_ORDER_ENDPOINT,
			{
				"subscription": subscription,
				"pricing_name": pricingName
			},
			<HttpResponseParser<Order>> {
				deserialize(content: any): Order {
                    return Object.assign(new Order(), JSON.parse(content));
				}
			},
			HttpMethod.PUT);
		} 
		catch (e) {
			this.handleError(e);
		}
	}

    /**
     * Pay order with smart contract by wallet application.
     */
	async payOrder(): Promise<number> {
        return await new Promise<number>((resolve, reject) => {
            reject(new NotImplementedException());
        });
    }

	/**
	 * Settle the order by the contract order id.
	 *
	 * @param orderId The order id from paying order.
	 */
	async settleOrder(orderId: number): Promise<Receipt> {
		checkNotNull(orderId, "Missing order id.");

		try {	
			return await this.httpClient.send<Receipt>(`${PaymentService.API_ORDER_ENDPOINT}/${orderId}`, {},
                <HttpResponseParser<Receipt>> {
                    deserialize(content: any): Receipt {
                        return Object.assign(new Receipt(), JSON.parse(content));
                    }
                },
                HttpMethod.POST);
		} 
		catch (e) {
			this.handleError(e);
		}
	}

	/**
	 * Get the order information by the order id.
	 *
	 * @param subscription vault/backup
	 * @param orderId The contract order id.
	 * @return The details of the order.
	 * @throws HiveException The error comes from the hive node.
	 */
	async getOrder(subscription: string, orderId: string): Promise<Order> {
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
		return await this.getOrdersInternal(subscription);
	}

	private async getOrdersInternal(subscription: string, orderId?: string): Promise<Order[]> {
		try {	
			return await this.httpClient.send<Order[]>(PaymentService.API_ORDER_ENDPOINT, { "subscription": subscription, "order_id": orderId },
			<HttpResponseParser<Order[]>> {
				deserialize(content: any): Order[] {
					const jsonObjs: [] = JSON.parse(content)['orders'];
					return jsonObjs.map(o => Object.assign(new Order(), o));
				}
			},
			HttpMethod.GET);
		} 
		catch (e) {
			this.handleError(e);
		}
	}

	/**
	 * Get the receipt by the order id.
	 *
	 * @param orderId The order id.
	 * @return The details of the receipt.
	 * @throws HiveException The error comes from the hive node.
	 */
	async getReceipt(orderId: string): Promise<Receipt> {
		try {	
			return await this.httpClient.send<Receipt>(PaymentService.API_RECEIPT_ENDPOINT, { "order_id": orderId },
			<HttpResponseParser<Receipt>> {
				deserialize(content: any): Receipt {
                    return Object.assign(new Receipt(), JSON.parse(content));
				}
			},
			HttpMethod.GET);
		} 
		catch (e) {
			this.handleError(e);
		}
	}

	/**
	 * Get the version of the payment module.
	 *
	 * @return The version.
	 * @throws HiveException The error comes from the hive node.
	 */
	async getVersion(): Promise<string> {
		try {	
			return await this.httpClient.send<string>(PaymentService.API_VERSION_ENDPOINT, HttpClient.NO_PAYLOAD,
			<HttpResponseParser<string>> {
				deserialize(content: any): string {
					return JSON.parse(content)['version'];
				}
			},
			HttpMethod.GET);
		} 
		catch (e) {
			this.handleError(e);
		}
	}

	private handleError(e: Error): void {
		if (e instanceof NodeRPCException) {
			throw e;
		}
		throw new NetworkException(e.message, e);
	}
}