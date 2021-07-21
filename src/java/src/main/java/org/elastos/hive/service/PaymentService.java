package org.elastos.hive.service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.elastos.hive.subscription.payment.Order;
import org.elastos.hive.subscription.payment.Receipt;

/**
 * The payment service provides users with the way to purchase a paid vault or
 * backup service, such as to subscribe to a new vault or backup with paid
 * pricing plan or extend the purchased subscription service.
 *
 */
public interface PaymentService {
	/**
	 * Place an order for new subscription or extending the existing subscription
	 * service.
	 *
	 * @param planName the name of the pricing plan
	 * @return
	 * 		return the new order detail when the request successfully was received
	 * 		by back-end node, otherwise return the specific exception.
	 */
	CompletableFuture<Order> placeOrder(String planName);

	/**
	 * Obtain the order detail according to the given order id.
	 *
	 * @param orderId order id
	 * @return
	 *		return the order detail in case there is a order with order id existing.
	 *		otherwise, return the specific exception.
	 */
	CompletableFuture<Order> getOrder(String orderId);


	/**
	 * Obtain all the list of order detail.
	 *
	 * @return
	 *		return the list of order detail on success, otherwise, return the specific
	 *		exception.
	 */
	CompletableFuture<List<Order>> getOrderList();

	/**
	 * Pay for the order with a given id.
	 *
	 * @param orderId order id
	 * @param transactionId the transaction id on the block-chain.
	 * @return
	 * 		return the receipt detail in case the payment was accepted by hive
	 * 		node, otherwise return the specific exception.
	 */
	CompletableFuture<Receipt> payOrder(String orderId, String transactionId);

	/**
	 * Obtain the receipt detail according to the order id.
	 *
	 * @param orderId order id.
	 * @return
	 * 		return the receipt detail in case there is a receipt existing,
	 * 		otherwise, return the specific exception.
	 */
	CompletableFuture<Receipt> getReceipt(String orderId);

	/**
	 * Obtain the version of the payment module.
	 *
	 * @return
	 *		return the version, otherwise, return the specific exception.
	 */
	CompletableFuture<String> getVersion();
}
