import { Order, Receipt, VaultSubscriptionService } from "@elastosfoundation/elastos-hive-js-sdk";
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

describe("test payment service", () => {
	const PRICING_PLAN_NAME = "Rookie";
    const ORDER_ID = "61f8bce772f0d0456cf3289e";
    const TRANS_ID = "6fZEM5A6dVWoUR2pScT6TkWNiseYahcnFzgOyqqgOA1NHdgz6jVZekbVCW5zA";

	let testData: TestData;
    let testOrderId: string;
    let testTransactionId: string;
	let vaultSubscriptionService: VaultSubscriptionService;

    beforeAll(async () => {
		testData = await TestData.getInstance("paymentservice.test", ClientConfig.CUSTOM, TestData.USER_DIR);
        vaultSubscriptionService = new VaultSubscriptionService(testData.getAppContext(), testData.getProviderAddress());
        try {
            await vaultSubscriptionService.subscribe();    
        } catch (e){
            console.log("vault is already subscribed");
        }
	});

    test("testgetversion", async () => {
		let paymentVersion = await vaultSubscriptionService.getVersion();
		expect(paymentVersion).not.toBeNull();
        console.log("Payment Service version: " + paymentVersion);
    });

    test("testPlaceOrder", async () => {
        let order: Order = await vaultSubscriptionService.placeOrder(PRICING_PLAN_NAME);
        expect(order).not.toBeNull();
        testOrderId = order.getOrderId();
        expect(testOrderId).not.toBeNull();
    });

    test("testPayOrder", async () => {
        let receipt: Receipt = await vaultSubscriptionService.payOrder(ORDER_ID, TRANS_ID);
        expect(receipt).not.toBeNull();
        testTransactionId = receipt.getReceiptId();
        expect(testTransactionId).not.toBeNull();
        expect(receipt.getOrderId()).not.toBeNull();
    });

    test("testGetReceipt", async () => {
        let receipt: Receipt = await vaultSubscriptionService.getReceipt(ORDER_ID);
        expect(receipt).not.toBeNull();
        expect(receipt.getReceiptId()).not.toBeNull();
        expect(receipt.getOrderId()).not.toBeNull();
        testTransactionId = receipt.getTransactionId();
    });

    test("testGetOrder", async () => {
        let order: Order = await vaultSubscriptionService.getOrder(ORDER_ID);
        expect(order).not.toBeNull();
        expect(order.getOrderId()).not.toBeNull();
    });

    test("testGetOrders", async () => {
        let orders: Order[] = await vaultSubscriptionService.getOrderList();
        expect(orders).not.toBeNull();
        expect(orders.length).toBeGreaterThan(0);
    });

});