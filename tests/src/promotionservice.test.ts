import { TestData } from "./config/testdata";

import {PromotionService, VaultSubscription} from "@elastosfoundation/hive-js-sdk";

describe.skip("test database services", () => {
    let promotionService: PromotionService;

    beforeAll(async () => {
        const testData = await TestData.getInstance("promotionservice.tests");
        promotionService = testData.newBackup().getPromotionService();
        const vaultSubscription = new VaultSubscription(
            testData.getUserAppContext(),
            testData.getProviderAddress());
        try {
            await vaultSubscription.unsubscribe();
        } catch (e) {
            // do nothing.
        }
    });

    test("testPromote", async () => {
        await promotionService.promote();
    });
});
