import { VaultSubscriptionService, PricingPlan, VaultInfo } from "@dchagastelles/elastos-hive-js-sdk";
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

describe("test subscribe function", () => {

    let testData: TestData;
    let subscriptionService: VaultSubscriptionService;
    let PRICING_PLAN_NAME: string = "Rookie";

    beforeEach(async () => {
        testData = await TestData.getInstance(ClientConfig.CUSTOM, TestData.USER_DIR);
        subscriptionService = new VaultSubscriptionService(
            testData.getAppContext(),
            testData.getProviderAddress());
    });

    test("get pricing plans", async() => {
        let plans: PricingPlan[] = await subscriptionService.getPricingPlanList();
        expect(plans).not.toBeNull();
        expect(plans.length).toBeGreaterThan(0);
    });


    test("get pricing plan", async() => {
        let plan: PricingPlan = await subscriptionService.getPricingPlan(PRICING_PLAN_NAME);
        expect(plan).not.toBeNull();
        expect(plan.getName()).toBe(PRICING_PLAN_NAME);
    });

    test("should subscribe and unsubscribe", async () => {
        // Reset subscription
        try {
            await subscriptionService.unsubscribe()
        } catch (e) {}

        expect(await subscriptionService.subscribe()).not.toBeNull();
        expect(await subscriptionService.checkSubscription()).not.toBeNull();
        expect(await subscriptionService.unsubscribe()).not.toThrow();
    });
});


