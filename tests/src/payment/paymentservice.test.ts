import { Order, Receipt, VaultSubscription, Logger } from "../../../src";
import { TestData } from "../config/testdata";

describe.skip("test payment service", () => {
    const LOG = new Logger("paymentservice.test");

	const PRICING_PLAN_NAME = "Rookie";

	let testData: TestData;
    let testTransactionId: string;
	let vaultSubscription: VaultSubscription;

    beforeAll(async () => {
		testData = await TestData.getInstance("paymentservice.test");
        vaultSubscription = new VaultSubscription(testData.getAppContext(), testData.getProviderAddress());
        try {
            await vaultSubscription.subscribe();
        } catch (e){
            LOG.log("vault is already subscribed");
        }
	});

    test("testgetversion", async () => {
		let paymentVersion = await vaultSubscription.getVersion();
		expect(paymentVersion).not.toBeNull();
        LOG.log("Payment Service version: " + paymentVersion);
    });

    test("testPlaceOrder", async () => {
        let order: Order = await vaultSubscription.placeOrder(PRICING_PLAN_NAME);
        expect(order).not.toBeNull();
        console.log(`PROOF: ${order.getProof()}`);
        // testOrderId = order.getOrderId();
        // expect(testOrderId).not.toBeNull();
    });

    test("testSettleOrder", async () => {
        // payOrder from demo.

        let receipt: Receipt = await vaultSubscription.settleOrder(1);
        expect(receipt).not.toBeNull();
        testTransactionId = receipt.getReceiptId();
        expect(testTransactionId).not.toBeNull();
        expect(receipt.getOrderId()).not.toBeNull();
    });

    test("testGetOrder", async () => {
        let order: Order = await vaultSubscription.getOrder(1);
        expect(order).not.toBeNull();
        expect(order.getOrderId()).not.toBeNull();
    });

    test("testGetOrders", async () => {
        let orders: Order[] = await vaultSubscription.getOrderList();
        expect(orders).not.toBeNull();
        expect(orders.length).toBeGreaterThan(0);
    });

    test("testGetReceipt", async () => {
        const receipts: Receipt[] = await vaultSubscription.getReceipts(1);
        expect(receipts.length).toEqual(1);
        expect(receipts[0].getReceiptId()).not.toBeNull();
        expect(receipts[0].getOrderId()).not.toBeNull();
    });

    test("testGetReceipts", async () => {
        const receipts: Receipt[] = await vaultSubscription.getReceipts();
        expect(receipts.length).toBeGreaterThanOrEqual(1);
        expect(receipts[0].getReceiptId()).not.toBeNull();
        expect(receipts[0].getOrderId()).not.toBeNull();
    });

});