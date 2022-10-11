import { TestData } from "./config/testdata";
import {PromotionService, VaultSubscription} from "../../src";

describe.skip("test database services", () => {
    let testData:TestData;
    let promotionService: PromotionService;

    beforeAll(async () => {
        testData = await TestData.getInstance("promotionservice.tests");
        const vaultSubscription = new VaultSubscription(
            testData.getUserAppContext(),
            testData.getProviderAddress());
        try {
            await vaultSubscription.unsubscribe(true);
        } catch (e) {
            // do nothing.
        }
        promotionService = testData.newBackup().getPromotionService();
    });

    test("testPromote", async () => {
        await promotionService.promote();
    });
});
