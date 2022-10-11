import {
    VaultSubscription,
    PricingPlan,
    BackupSubscription,
    Order,
    AlreadyExistsException, SubscriptionInfo
} from "../../../src";
import { TestData } from "../config/testdata";

describe("test vault subscribe function", () => {

    let testData: TestData;
    let vaultSubscription: VaultSubscription;
    let PRICING_PLAN_NAME = "Rookie";

    beforeEach(async () => {
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

    test("testGetAppStats", async () => {
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
        expect(appStats[0].getName()).not.toBeNull();
        expect(appStats[0].getDeveloperDid()).not.toBeNull();
        expect(appStats[0].getIconUrl()).not.toBeNull();
        expect(appStats[0].getUserDid()).toBeTruthy();
        expect(appStats[0].getAppDid()).toBeTruthy();
        expect(appStats[0].getUsedStorageSize()).toBeGreaterThanOrEqual(0);
        expect(appStats[0].getAccessCount()).toBeGreaterThanOrEqual(0);
        expect(appStats[0].getAccessAmount()).toBeGreaterThanOrEqual(0);
    });

    test("testSubscribeCheckUnsubscribe", async () => {
        try {
            const vaultInfo = await vaultSubscription.subscribe();
            expect(vaultInfo).not.toBeNull();
        } catch (e) {
            if (!(e instanceof AlreadyExistsException)) {
                throw e;
            }
        }

        // await vaultSubscription.activate();

        const result: SubscriptionInfo = await vaultSubscription.checkSubscription();
        expect(result).not.toBeNull();
        // expect(result.getEndTime()).toBeTruthy();
        expect(result.getAccessCount()).toBeGreaterThanOrEqual(0);

        // await vaultSubscription.deactivate();

        await vaultSubscription.unsubscribe(true);
    });
});


describe("test backup subscribe function", () => {

    let testData: TestData;
    let backupSubscription: BackupSubscription;
    let PRICING_PLAN_NAME = "Rookie";

    beforeEach(async () => {
        testData = await TestData.getInstance("backup subscribe.test");
        backupSubscription = new BackupSubscription(
            testData.getUserAppContext(),
            testData.getProviderAddress());
    });

    test("testGetPricingPlanList", async() => {
        let plans: PricingPlan[] = await backupSubscription.getPricingPlanList();
        expect(plans).not.toBeNull();
        expect(plans.length).toBeGreaterThan(0);
    });

    test("testGetPricingPlan", async() => {
        let plan: PricingPlan = await backupSubscription.getPricingPlan(PRICING_PLAN_NAME);
        expect(plan).not.toBeNull();
        expect(plan.getName()).toBe(PRICING_PLAN_NAME);
    });

    test("testSubscribeCheckUnsubscribe", async () => {
        let backupInfo;
        try {
            backupInfo = await backupSubscription.subscribe();
        } catch (e) {
            await backupSubscription.unsubscribe();
            backupInfo = await backupSubscription.subscribe();
        }
        expect(backupInfo).not.toBeNull();
        const result: SubscriptionInfo = await backupSubscription.checkSubscription();
        expect(result).not.toBeNull();
        expect(result.getEndTime()).toBeTruthy();
        let error = null;
        try {
            await backupSubscription.unsubscribe()
        } catch (e) {
            error = e;
        }
        expect(error).toBeNull();
    });
});


