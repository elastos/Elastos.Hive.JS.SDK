package org.elastos.hive;

import org.elastos.hive.config.TestData;
import org.elastos.hive.subscription.payment.Order;
import org.elastos.hive.subscription.payment.Receipt;
import org.elastos.hive.service.PaymentService;
import org.junit.jupiter.api.*;

import java.util.List;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class VaultPaymentTest {
	// INFO: to make test ok, please keep this two value at the same time.
	private static final String ORDER_ID = "60ee8c056fdd17b16bb5b4c2";
	private static final String TRANS_ID = "280a24034bfb241c31b5a73c792c9d05df2b1f79bb98733c5358aeb909c27010";
	private static final String PRICING_PLAN_NAME = "Rookie";

	private static PaymentService paymentService;

	@BeforeAll public static void setUp() {
		Assertions.assertDoesNotThrow(()->{
			TestData testData = TestData.getInstance();
			paymentService = new VaultSubscription(testData.getAppContext(), testData.getProviderAddress());
		});
	}

	@Test @org.junit.jupiter.api.Order(1)
	void testGetVersion() {
		Assertions.assertDoesNotThrow(()->{
			String version = paymentService.getVersion().get();
			Assertions.assertNotNull(version);
		});
	}

	@Disabled
	@Test @org.junit.jupiter.api.Order(2)
	void testPlaceOrder() {
		Assertions.assertDoesNotThrow(()->{
			Order order = paymentService.placeOrder(PRICING_PLAN_NAME).get();
			Assertions.assertNotNull(order);
			Assertions.assertNotNull(order.getOrderId());
		});
	}

	@Disabled
	@Test @org.junit.jupiter.api.Order(3)
	void testPayOrder() {
		Assertions.assertDoesNotThrow(()->{
			Receipt receipt = paymentService.payOrder(ORDER_ID, TRANS_ID).get();
			Assertions.assertNotNull(receipt);
			Assertions.assertNotNull(receipt.getReceiptId());
			Assertions.assertNotNull(receipt.getOrderId());
		});
	}

	@Disabled
	@Test @org.junit.jupiter.api.Order(4)
	void testGetOrder() {
		Assertions.assertDoesNotThrow(()->{
			Order order = paymentService.getOrder(ORDER_ID).get();
			Assertions.assertNotNull(order);
			Assertions.assertNotNull(order.getOrderId());
		});
	}

	@Disabled
	@Test @org.junit.jupiter.api.Order(5)
	void testGetOrders() {
		Assertions.assertDoesNotThrow(()->{
			List<Order> orders = paymentService.getOrderList().get();
			Assertions.assertNotNull(orders);
			Assertions.assertFalse(orders.isEmpty());
		});
	}

	@Disabled
	@Test @org.junit.jupiter.api.Order(6)
	void testGetReceipt() {
		Assertions.assertDoesNotThrow(()->{
			Receipt receipt = paymentService.getReceipt(ORDER_ID).get();
			Assertions.assertNotNull(receipt);
			Assertions.assertNotNull(receipt.getReceiptId());
			Assertions.assertNotNull(receipt.getOrderId());
		});
	}

	@Disabled
	@Test @org.junit.jupiter.api.Order(3)
	void testMakeOrderProcess() {
		Assertions.assertDoesNotThrow(()->{
			Order order = paymentService.placeOrder(PRICING_PLAN_NAME).get();
			Assertions.assertNotNull(order);
			Assertions.assertNotNull(order.getOrderId());
			order = paymentService.getOrder(order.getOrderId()).get();
			Assertions.assertNotNull(order);
			Assertions.assertNotNull(order.getOrderId());
			Receipt receipt = paymentService.payOrder(order.getOrderId(), TRANS_ID).get();
			Assertions.assertNotNull(receipt);
			Assertions.assertNotNull(receipt.getReceiptId());
			Assertions.assertNotNull(receipt.getOrderId());
		});
	}
}
