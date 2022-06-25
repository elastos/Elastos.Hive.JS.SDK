import {Order, OrderState, Receipt, VaultSubscription, Logger, BackupSubscription} from "../../../src";
import { TestData } from "../config/testdata";

describe("test payment service", () => {
    const LOG = new Logger("paymentservice.test");

	const PRICING_PLAN_NAME = "Rookie";

	let testData: TestData;
	let vaultSubscription: VaultSubscription;
	let backupSubscription: BackupSubscription;

    beforeAll(async () => {
		testData = await TestData.getInstance("paymentservice.test");
        vaultSubscription = new VaultSubscription(testData.getUserAppContext(), testData.getProviderAddress());
        try {
            await vaultSubscription.subscribe();
        } catch (e){
            LOG.log("vault is already subscribed");
        }

        backupSubscription = new BackupSubscription(testData.getUserAppContext(), testData.getProviderAddress());
        try {
            await backupSubscription.subscribe();
        } catch (e){
            LOG.log("vault is already subscribed");
        }
	});

    test("testgetversion", async () => {
		let paymentVersion = await vaultSubscription.getVersion();
		expect(paymentVersion).not.toBeNull();
        LOG.log("Payment Service version: " + paymentVersion);
    });

    test.skip("testPlaceOrder", async () => {
        let order: Order = await vaultSubscription.placeOrder(PRICING_PLAN_NAME);
        expect(order).not.toBeNull();
        expect(order.getSubscription()).toEqual('vault');
        expect(order.getPricingPlan()).toEqual(PRICING_PLAN_NAME);
        expect(order.getPayingDid()).not.toBeNull();
        expect(order.getPaymentAmount()).toBeGreaterThan(0);
        expect(order.getCreateTime()).toBeGreaterThan(0);
        expect(order.getExpirationTime()).toBeGreaterThan(0);
        expect(order.getReceivingAddress()).not.toBeNull();
        expect(order.getState()).toEqual(OrderState.NORMAL);
        expect(order.getProof()).not.toBeNull();
        console.log(`PROOF: ${order.getProof()}`);
    });

    test.skip("testPlaceOrder backup", async () => {
        let order: Order = await backupSubscription.placeOrder(PRICING_PLAN_NAME);
        expect(order).not.toBeNull();
        expect(order.getSubscription()).toEqual('backup');
        expect(order.getPricingPlan()).toEqual(PRICING_PLAN_NAME);
        expect(order.getPayingDid()).not.toBeNull();
        expect(order.getPaymentAmount()).toBeGreaterThan(0);
        expect(order.getCreateTime()).toBeGreaterThan(0);
        expect(order.getExpirationTime()).toBeGreaterThan(0);
        expect(order.getReceivingAddress()).not.toBeNull();
        expect(order.getState()).toEqual(OrderState.NORMAL);
        expect(order.getProof()).not.toBeNull();
        console.log(`PROOF: ${order.getProof()}`);
    });

    test.skip("testSettleOrder", async () => {
        // payOrder from demo.

        let receipt: Receipt = await vaultSubscription.settleOrder(1);
        expect(receipt).not.toBeNull();
        expect(receipt.getReceiptId()).not.toBeNull();
        expect(receipt.getOrderId()).not.toBeNull();
        expect(receipt.getSubscription()).toEqual('vault');
        expect(receipt.getPricingPlan()).toEqual(PRICING_PLAN_NAME);
        expect(receipt.getPaymentAmount()).toBeGreaterThan(0);
        expect(receipt.getPaidDid()).not.toBeNull();
        expect(receipt.getCreateTime()).toBeGreaterThan(0);
        expect(receipt.getReceivingAddress()).not.toBeNull();
        expect(receipt.getReceiptProof()).not.toBeNull();
    });

    test.skip("testSettleOrder backup", async () => {
        // payOrder from demo.

        let receipt: Receipt = await backupSubscription.settleOrder(3);
        expect(receipt).not.toBeNull();
        expect(receipt.getReceiptId()).not.toBeNull();
        expect(receipt.getOrderId()).not.toBeNull();
        expect(receipt.getSubscription()).toEqual('backup');
        expect(receipt.getPricingPlan()).toEqual(PRICING_PLAN_NAME);
        expect(receipt.getPaymentAmount()).toBeGreaterThan(0);
        expect(receipt.getPaidDid()).not.toBeNull();
        expect(receipt.getCreateTime()).toBeGreaterThan(0);
        expect(receipt.getReceivingAddress()).not.toBeNull();
        expect(receipt.getReceiptProof()).not.toBeNull();
    });

    test.skip("testGetOrder", async () => {
        const order: Order = await vaultSubscription.getOrder(1);
        expect(order).not.toBeNull();
        expect(order.getSubscription()).not.toBeNull();
        expect(order.getPricingPlan()).toEqual(PRICING_PLAN_NAME);
        expect(order.getPayingDid()).not.toBeNull();
        expect(order.getPaymentAmount()).toBeGreaterThan(0);
        expect(order.getCreateTime()).toBeGreaterThan(0);
        expect(order.getExpirationTime()).toBeGreaterThan(0);
        expect(order.getReceivingAddress()).not.toBeNull();
        expect(order.getState()).not.toBeNull();
        expect(order.getProof()).not.toBeNull();
    });

    test.skip("testGetOrders", async () => {
        const orders: Order[] = await vaultSubscription.getOrderList();
        expect(orders).not.toBeNull();
        expect(orders.length).toBeGreaterThan(0);
        const order: Order = orders[0];
        expect(order.getSubscription()).not.toBeNull();
        expect(order.getPricingPlan()).toEqual(PRICING_PLAN_NAME);
        expect(order.getPayingDid()).not.toBeNull();
        expect(order.getPaymentAmount()).toBeGreaterThan(0);
        expect(order.getCreateTime()).toBeGreaterThan(0);
        expect(order.getExpirationTime()).toBeGreaterThan(0);
        expect(order.getReceivingAddress()).not.toBeNull();
        expect(order.getState()).not.toBeNull();
        expect(order.getProof()).not.toBeNull();
    });

    test.skip("testGetReceipt", async () => {
        const receipts: Receipt[] = await vaultSubscription.getReceipts(1);
        expect(receipts.length).toEqual(1);
        const receipt = receipts[0];
        expect(receipt).not.toBeNull();
        expect(receipt.getReceiptId()).not.toBeNull();
        expect(receipt.getOrderId()).not.toBeNull();
        expect(receipt.getSubscription()).not.toBeNull();
        expect(receipt.getPricingPlan()).toEqual(PRICING_PLAN_NAME);
        expect(receipt.getPaymentAmount()).toBeGreaterThan(0);
        expect(receipt.getPaidDid()).not.toBeNull();
        expect(receipt.getCreateTime()).toBeGreaterThan(0);
        expect(receipt.getReceivingAddress()).not.toBeNull();
        expect(receipt.getReceiptProof()).not.toBeNull();
    });

    test.skip("testGetReceipts", async () => {
        const receipts: Receipt[] = await vaultSubscription.getReceipts();
        expect(receipts.length).toBeGreaterThanOrEqual(1);
    });

});