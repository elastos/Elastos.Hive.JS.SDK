import { TestData } from "./config/testdata";

import {PromotionService, VaultSubscriptionService} from "@elastosfoundation/hive-js-sdk";

describe.skip("test database services", () => {
    let promotionService: PromotionService;

    beforeAll(async () => {
        const testData = await TestData.getInstance("promotionservice.tests");
        promotionService = testData.newBackup().getPromotionService();
        const vaultSubscriptionService = new VaultSubscriptionService(
            testData.getAppContext(),
            testData.getProviderAddress());
        try {
            await vaultSubscriptionService.unsubscribe();
        } catch (e) {
            // do nothing.
        }
    });

    test("testPromote", async () => {
        await promotionService.promote();
    });
});
