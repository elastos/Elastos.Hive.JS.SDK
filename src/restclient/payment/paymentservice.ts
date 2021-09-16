import { HttpClient } from "../../http/httpclient";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';
import { RestService } from "../restservice";
import { Order } from  "../../domain/payment/order";
import { Receipt } from  "../../domain/payment/receipt";

export class PaymentService extends RestService {
	private static LOG = new Logger("PaymentService");

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
		return await new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*
		try {
			return paymentAPI.placeOrder(new CreateOrderParams(subscription, pricingName)).execute().body();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
*/
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
		return await new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*
		try {
			return paymentAPI.payOrder(orderId, new PayOrderParams(transactionId)).execute().body();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
*/
	}

	/**
	 * Get the order information by the order id.
	 *
	 * @param orderId The order id.
	 * @return The details of the order.
	 * @throws HiveException The error comes from the hive node.
	 */
	public async getOrder(orderId: string): Promise<Order> {
		return await new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*
		List<Order> orders = getOrdersInternal("vault", orderId);
		return orders.get(0);
*/
	}

	/**
	 * Get the orders by the subscription type.
	 *
	 * @param subscription The value is "vault" or "backup".
	 * @return The order list, MUST not empty.
	 * @throws HiveException The error comes from the hive node.
	 */
	public async getOrders(subscription: string): Promise<Order[]> {
		return await new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
		//return getOrdersInternal(subscription, null);
	}

	private async getOrdersInternal(subscription: string, orderId: string): Promise<Order[]> {
		return await new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*
		try {
			return paymentAPI.getOrders(subscription, orderId).execute().body().getOrders();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
*/
	}

	/**
	 * Get the receipt by the order id.
	 *
	 * @param orderId The order id.
	 * @return The details of the receipt.
	 * @throws HiveException The error comes from the hive node.
	 */
	public async getReceipt(orderId: string): Promise<Receipt> {
		return await new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*
		try {
			return paymentAPI.getReceipt(orderId).execute().body();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
*/
	}

	/**
	 * Get the version of the payment module.
	 *
	 * @return The version.
	 * @throws HiveException The error comes from the hive node.
	 */
	public async getVersion(): Promise<string> {
		return await new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*
		try {
			return paymentAPI.getVersion().execute().body().getVersion();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
*/
	}

}