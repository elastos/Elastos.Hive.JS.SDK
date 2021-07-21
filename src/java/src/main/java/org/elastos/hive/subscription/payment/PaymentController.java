package org.elastos.hive.subscription.payment;

import org.elastos.hive.connection.NodeRPCConnection;
import org.elastos.hive.connection.NodeRPCException;
import org.elastos.hive.exception.*;

import java.io.IOException;
import java.security.InvalidParameterException;
import java.util.List;

public class PaymentController {
	private PaymentAPI paymentAPI;

	public PaymentController(NodeRPCConnection connection) {
		paymentAPI = connection.createService(PaymentAPI.class, true);
	}

	public Order placeOrder(String subscription, String pricingName) throws HiveException {
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
	}

	public Receipt payOrder(String orderId, String transactionId) throws HiveException {
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
	}

	public Order getOrder(String orderId) throws HiveException {
		List<Order> orders = getOrdersInternal("vault", orderId);
		return orders.get(0);
	}

	public List<Order> getOrders(String subscription) throws HiveException {
		return getOrdersInternal(subscription, null);
	}

	private List<Order> getOrdersInternal(String subscription, String orderId) throws HiveException {
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
	}

	public Receipt getReceipt(String orderId) throws HiveException {
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
	}

	public String getVersion() throws HiveException {
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
	}
}
