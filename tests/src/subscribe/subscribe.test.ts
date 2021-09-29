import { VaultSubscriptionService } from "@dchagastelles/elastos-hive-js-sdk/"
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

describe("test subscribe function", () => {

    let testData: TestData;
    let subscriptionService: VaultSubscriptionService;
    let PRICING_PLAN_NAME: String = "Rookie";

    beforeEach(async () => {
        testData = await TestData.getInstance(ClientConfig.DEV, "/home/diego/temp");
        subscriptionService = new VaultSubscriptionService(
            testData.getAppContext(),
            testData.getProviderAddress());
    });

    test.skip("testGetPricingPlanList", async () => {
        let plans = subscriptionService.getPricingPlanList().get();
        expect(plans).not.toBeNull();
        expect(plans.isEmpty()).toBeFalsy();
    });

    test.skip("testGetPricingPlan", async () => {
        let plan = subscriptionService.getPricingPlan(PRICING_PLAN_NAME).get();
        expect(plan).not.toBeNull();
        expect(plan.getName()===PRICING_PLAN_NAME).toBeTruthy();
    });

    test("testSubscribe", async () => {
        const vaultInfo = await subscriptionService.subscribe();
    });
    
    test.skip("testCheckSubscription", async () => {
        expect(await subscriptionService.checkSubscription().get()).not.toBeNull();
    });

  
    test.skip("testUnsubscribe", async () => {
        expect(await subscriptionService.unsubscribe().get()).not.toThrow();
    });

    test.skip("testGetFileHashProcess", async () => {
        expect(await subscriptionService.subscribe().get()).not.toThrow();
        // TODO: new FilesServiceTest().testHash();
        expect(await subscriptionService.unsubscribe().get()).not.toThrow();
    });

});


