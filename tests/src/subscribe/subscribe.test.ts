import { VaultSubscriptionService, PricingPlan } from "@dchagastelles/elastos-hive-js-sdk/"
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

describe("test subscribe function", () => {

    let testData: TestData;
    let subscriptionService: VaultSubscriptionService;

    beforeEach(async () => {
        testData = await TestData.getInstance(ClientConfig.CUSTOM, "/home/carlduranleau/temp");
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
        let plan: PricingPlan = await subscriptionService.getPricingPlan("Rookie");
        expect(plan).not.toBeNull();
        expect(plan.getName()).toBe("Rookie");
    });


/*    test("should return vault info", async () => {
        const vaultInfo = await subscriptionService.subscribe();
    });*/
});


