import {
    VaultSubscription,
    PricingPlan,
    BackupSubscription,
    Order,
    AlreadyExistsException
} from "../../../src";
import { TestData } from "../config/testdata";

describe("test vault subscribe function", () => {

    let testData: TestData;
    let vaultSubscription: VaultSubscription;
    let PRICING_PLAN_NAME = "Rookie";

    beforeAll(async () => {
        testData = await TestData.getInstance("vault subscribe.test");
        vaultSubscription = new VaultSubscription(
            testData.getUserAppContext(),
            testData.getProviderAddress());
    });

    test("testGetPricingPlanList", async() => {
        let plans: PricingPlan[] = await vaultSubscription.getPricingPlanList();
        expect(plans).not.toBeNull();
        expect(plans.length).toBeGreaterThan(0);
    });

    test("testGetPricingPlan", async() => {
        let plan: PricingPlan = await vaultSubscription.getPricingPlan(PRICING_PLAN_NAME);
        expect(plan).not.toBeNull();
        expect(plan.getName()).toBe(PRICING_PLAN_NAME);
    });

    test("testGetVersion", async() => {
        let version: string = await vaultSubscription.getVersion();
        expect(version).not.toBeNull();
    });

    test.skip("testPlaceOrder", async() => {
        let order: Order = await vaultSubscription.placeOrder(PRICING_PLAN_NAME);
        expect(order).not.toBeNull();
        expect(order.getOrderId()).not.toBeNull();
    });


    test.skip("testGetOrder", async() => {
        let order: Order = await vaultSubscription.placeOrder(PRICING_PLAN_NAME);
        expect(order).not.toBeNull();

        let order2: Order = await vaultSubscription.getOrder(order.getOrderId());
        expect(order2).toEqual(order);
    });

    // void () {
	// 	Assertions.assertDoesNotThrow(()->{
	// 		Order order = paymentService.placeOrder(PRICING_PLAN_NAME).get();
	// 		Assertions.assertNotNull(order);
	// 		Assertions.assertNotNull(order.getOrderId());
	// 	});
	// }

    test.skip("testGetAppStats", async () => {
        try {
            await vaultSubscription.subscribe();
        } catch (e) {
            if (!(e instanceof AlreadyExistsException)) {
                throw e;
            }
        }
        let appStats = await vaultSubscription.getAppStats();
        expect(appStats).not.toBeNull();
        expect(appStats).not.toEqual([]);
        expect(appStats[0].getName()).not.toEqual(null);
        expect(appStats[0].getDeveloperDid()).not.toEqual(null);
        expect(appStats[0].getIconUrl()).not.toEqual(null);
        expect(appStats[0].getUserDid()).not.toEqual(null);
        expect(appStats[0].getAppDid()).not.toEqual(null);
        expect(appStats[0].getUsedStorageSize()).toBeGreaterThanOrEqual(0);
    });

    test("testSubscribeCheckUnsubscribe", async () => {
        let vaultInfo;
        try {
            vaultInfo = await vaultSubscription.subscribe();
        } catch (e) {
            await vaultSubscription.unsubscribe();
            vaultInfo = await vaultSubscription.subscribe();
        }
        expect(vaultInfo).not.toBeNull();
        expect(await vaultSubscription.checkSubscription()).not.toBeNull();
        let error = null;
        try {
            await vaultSubscription.unsubscribe()
        } catch (e) {
            error = e;
        }
        expect(error).toBeNull();
    });
});


describe("test backup subscribe function", () => {

    let testData: TestData;
    let backupsubscriptionService: BackupSubscription;
    let PRICING_PLAN_NAME = "Rookie";

    beforeAll(async () => {
        testData = await TestData.getInstance("backup subscribe.test");
        backupsubscriptionService = new BackupSubscription(
            testData.getUserAppContext(),
            testData.getProviderAddress());
    });

    test("testGetPricingPlanList", async() => {
        let plans: PricingPlan[] = await backupsubscriptionService.getPricingPlanList();
        expect(plans).not.toBeNull();
        expect(plans.length).toBeGreaterThan(0);
    });

    test("testGetPricingPlan", async() => {
        let plan: PricingPlan = await backupsubscriptionService.getPricingPlan(PRICING_PLAN_NAME);
        expect(plan).not.toBeNull();
        expect(plan.getName()).toBe(PRICING_PLAN_NAME);
    });

    test("testSubscribeCheckUnsubscribe", async () => {
        let backupInfo;
        try {
            backupInfo = await backupsubscriptionService.subscribe();
        } catch (e) {
            await backupsubscriptionService.unsubscribe();
            backupInfo = await backupsubscriptionService.subscribe();
        }
        expect(backupInfo).not.toBeNull();
        expect(await backupsubscriptionService.checkSubscription()).not.toBeNull();
        let error = null;
        try {
            await backupsubscriptionService.unsubscribe()
        } catch (e) {
            error = e;
        }
        expect(error).toBeNull();
    });
});


