import {AlreadyExistsException, VaultSubscription} from "../../src";
import {TestData} from "./config/testdata";

/**
 * Please run this file in mainnet
 */

describe.skip("test service without provider address", () => {
    test("testDatabaseServiceWithoutProviderAddress", async () => {
        const testData = await TestData.getInstance("vault subscribe.test");
        const vaultSubscription = new VaultSubscription(testData.getUserAppContext());
        try {
            await vaultSubscription.subscribe();
        } catch (e) {
            if (!(e instanceof AlreadyExistsException)) {
                throw e;
            }
        }
    });
});
