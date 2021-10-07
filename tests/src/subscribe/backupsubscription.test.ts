import { PricingPlan, VaultInfo, BackupSubscriptionService } from "@dchagastelles/elastos-hive-js-sdk";
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

describe("test backup subscription function", () => {

    let testData: TestData;
    let backupSubscriptionService: BackupSubscriptionService;
    let PRICING_PLAN_NAME: string = "Rookie";

    beforeEach(async () => {
        testData = await TestData.getInstance(ClientConfig.CUSTOM, TestData.USER_DIR);
        backupSubscriptionService = new BackupSubscriptionService(
            testData.getAppContext(),
            testData.getProviderAddress());
        });
        
    test("get pricing plans", async() => {
        let plans: PricingPlan[] = await backupSubscriptionService.getPricingPlanList();
        expect(plans).not.toBeNull();
        expect(plans.length).toBeGreaterThan(0);
    });
    
    test("get pricing plan", async() => {
        let plan: PricingPlan = await backupSubscriptionService.getPricingPlan(PRICING_PLAN_NAME);
        expect(plan).not.toBeNull();
        expect(plan.getName()).toBe(PRICING_PLAN_NAME);
    });

    test("should return vault info", async () => {
        let vaultInfo : VaultInfo = await backupSubscriptionService.subscribe();
        expect(vaultInfo).not.toBeNull();
    });

    test.skip("should unsubscribe", async () => {
        expect(await backupSubscriptionService.unsubscribe()).not.toThrow();
    });
        
    test.skip("Check subscription", async() => {
        let info: VaultInfo = await backupSubscriptionService.checkSubscription();
        expect(info).not.toBeNull();
        console.log(JSON.stringify(info));

    });
    
});


