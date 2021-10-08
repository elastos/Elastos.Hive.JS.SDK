import { VaultSubscriptionService, PricingPlan, BackupSubscriptionService } from "@dchagastelles/elastos-hive-js-sdk";
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

describe("test subscribe function", () => {

    let testData: TestData;
    let vaultsubscriptionService: VaultSubscriptionService;
    let backupsubscriptionService: BackupSubscriptionService;
    let PRICING_PLAN_NAME: string = "Rookie";

    beforeEach(async () => {
        testData = await TestData.getInstance(ClientConfig.CUSTOM, TestData.USER_DIR);
        vaultsubscriptionService = new VaultSubscriptionService(
            testData.getAppContext(),
            testData.getProviderAddress());
        backupsubscriptionService = new BackupSubscriptionService(
            testData.getAppContext(),
            testData.getProviderAddress());
    });

    test("get vault pricing plans", async() => {
        let plans: PricingPlan[] = await vaultsubscriptionService.getPricingPlanList();
        expect(plans).not.toBeNull();
        expect(plans.length).toBeGreaterThan(0);
    });


    test("get vault pricing plan", async() => {
        let plan: PricingPlan = await vaultsubscriptionService.getPricingPlan(PRICING_PLAN_NAME);
        expect(plan).not.toBeNull();
        expect(plan.getName()).toBe(PRICING_PLAN_NAME);
    });

    test("should subscribe and unsubscribe to vault", async () => {
        let vaultInfo = {}
        try {
            vaultInfo = await vaultsubscriptionService.subscribe();
        } catch (e) {
            await vaultsubscriptionService.unsubscribe()
            vaultInfo = await vaultsubscriptionService.subscribe();
        }
        expect(vaultInfo).not.toBeNull();
        expect(await vaultsubscriptionService.checkSubscription()).not.toBeNull();
        expect(await vaultsubscriptionService.unsubscribe()).not.toThrow();
    });

    test("get backup pricing plans", async() => {
        let plans: PricingPlan[] = await backupsubscriptionService.getPricingPlanList();
        expect(plans).not.toBeNull();
        expect(plans.length).toBeGreaterThan(0);
    });

    test("get backup pricing plan", async() => {
        let plan: PricingPlan = await backupsubscriptionService.getPricingPlan(PRICING_PLAN_NAME);
        expect(plan).not.toBeNull();
        expect(plan.getName()).toBe(PRICING_PLAN_NAME);
    });


    test("should subscribe and unsubscribe to backup", async () => {
        let backupInfo = {}
        try {
            backupInfo = await backupsubscriptionService.subscribe();
        } catch (e) {
            await backupsubscriptionService.unsubscribe()
            backupInfo = await backupsubscriptionService.subscribe();
        }
        expect(backupInfo).not.toBeNull();
        expect(await backupsubscriptionService.checkSubscription()).not.toBeNull();
        expect(await backupsubscriptionService.unsubscribe()).not.toThrow();
    });
});


