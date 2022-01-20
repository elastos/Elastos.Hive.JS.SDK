import { TestData } from "./config/testdata";

import {PromotionService, VaultSubscriptionService} from "../../src";
import { ClientConfig } from "./config/clientconfig";

describe.skip("test database services", () => {
    let promotionService: PromotionService;

    beforeAll(async () => {
        const testData = await TestData.getInstance("promotionservice.tests", ClientConfig.CUSTOM, TestData.USER_DIR);
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
