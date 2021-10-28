import { HttpClient } from "../../http/httpclient";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';
import { RestService } from "../restservice";
import { Order } from  "../../domain/payment/order";
import { Receipt } from  "../../domain/payment/receipt";
import { checkNotNull } from "../../domain/utils";
import { HttpMethod } from "../../http/httpmethod";
import { IllegalArgumentException, NotFoundException } from "../../exceptions";
import { HttpResponseParser } from "../../http/httpresponseparser";
import { InvalidParameterException, NetworkException, NodeRPCException, ServerUnknownException, UnauthorizedException, VaultForbiddenException } from "../../exceptions";

export class PaymentService extends RestService {
	private static LOG = new Logger("PaymentService");

	private static API_ORDER_ENDPOINT = "/api/v2/payment/order";
	private static API_RECEIPT_ENDPOINT = "/api/v2/payment/receipt";
	private static API_VERSION_ENDPOINT = "/api/v2/payment/version";

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
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
	 public async placeOrder(subscription: string, pricingName: string): Promise<Order> {
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
					let jsonObj = JSON.parse(content);
					let order = new Order();
					order.setCreateTime(jsonObj['create_time']);
					order.setElaAddress(jsonObj['ela_address']);
					order.setElaAmount(jsonObj['ela_amount']);
					order.setOrderId(jsonObj['order_id']);
					order.setPricingName(jsonObj['pricina_name']);
					order.setProof(jsonObj['proof']);
					order.setSubscription(jsonObj['subscription']);

					return order;
				}
			},
			HttpMethod.PUT);
		} 
		catch (e) {
			this.handleError(e);
		}
	}

	/**
	 * Pay the order by the order id and the transaction id.
	 *
	 * @param orderId The order id.
	 * @param transactionId The transaction id.
	 * @return The receipt which is the proof of the payment of the order for the user.
	 * @throws HiveException The error comes from the hive node.
	 */
	public async payOrder(orderId: string, transactionId: string): Promise<Receipt> {
		checkNotNull(orderId, "Missing order id.");
		checkNotNull(transactionId, "Missing transaction id.");

		try {	
			return await this.httpClient.send<Receipt>(`${PaymentService.API_ORDER_ENDPOINT}/${orderId}`, { "transaction_id": transactionId },
			<HttpResponseParser<Receipt>> {
				deserialize(content: any): Receipt {
					let jsonObj = JSON.parse(content);
					let receipt = new Receipt();
					receipt.setReceiptId(jsonObj['receipt_id']);
					receipt.setOrderId(jsonObj['order_id']);
					receipt.setTransactionId(jsonObj['transaction_id']);
					receipt.setPricingName(jsonObj['pricing_name']);
					receipt.setPaidDid(jsonObj['paid_did']);
					receipt.setElaAmount(jsonObj['ela_amount']);
					receipt.setProof(jsonObj['proof']);

					return receipt;
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
	 * @param orderId The order id.
	 * @return The details of the order.
	 * @throws HiveException The error comes from the hive node.
	 */
	public async getOrder(subscription: string, orderId: string): Promise<Order> {
		checkNotNull(subscription, "Missing subscription.");
		checkNotNull(orderId, "Missing order id.");

		if (subscription != "vault" && subscription != "backup") {
			throw new IllegalArgumentException("Invalid subscription. Must be 'vault' or 'backup'");
		}

		return await this.getOrdersInternal(subscription, orderId)[0];
	}

	/**
	 * Get the orders by the subscription type.
	 *
	 * @param subscription The value is "vault" or "backup".
	 * @return The order list, MUST not empty.
	 * @throws HiveException The error comes from the hive node.
	 */
	public async getOrders(subscription: string): Promise<Order[]> {
		checkNotNull(subscription, "Missing subscription.");
		return await this.getOrdersInternal(subscription);
	}

	private async getOrdersInternal(subscription: string, orderId?: string): Promise<Order[]> {
		try {	
			return await this.httpClient.send<Order[]>(PaymentService.API_ORDER_ENDPOINT, { "subscription": subscription, "order_id": orderId },
			<HttpResponseParser<Order[]>> {
				deserialize(content: any): Order[] {
					let jsonObj = JSON.parse(content)['orders'];
					let orders = [];
					for (let orderObj in jsonObj) {
						let order = new Order();
						order.setCreateTime(orderObj['create_time']);
						order.setElaAddress(orderObj['ela_address']);
						order.setElaAmount(orderObj['ela_amount']);
						order.setOrderId(orderObj['order_id']);
						order.setPricingName(orderObj['pricina_name']);
						order.setProof(orderObj['proof']);
						order.setSubscription(orderObj['subscription']);	
						orders.push(order);
					}

					return orders;
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
	public async getReceipt(orderId: string): Promise<Receipt> {
		try {	
			return await this.httpClient.send<Receipt>(PaymentService.API_RECEIPT_ENDPOINT, { "order_id": orderId },
			<HttpResponseParser<Receipt>> {
				deserialize(content: any): Receipt {
					let jsonObj = JSON.parse(content);
					let receipt = new Receipt();
					receipt.setReceiptId(jsonObj['receipt_id']);
					receipt.setOrderId(jsonObj['order_id']);
					receipt.setTransactionId(jsonObj['transaction_id']);
					receipt.setPricingName(jsonObj['pricing_name']);
					receipt.setPaidDid(jsonObj['paid_did']);
					receipt.setElaAmount(jsonObj['ela_amount']);
					receipt.setProof(jsonObj['proof']);

					return receipt;
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
	public async getVersion(): Promise<string> {
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
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e.message, e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e.message, e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.message, e);
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e.message, e);
				default:
					throw new ServerUnknownException(e.message, e);
			}
		}
		throw new NetworkException(e.message, e);
	}
}