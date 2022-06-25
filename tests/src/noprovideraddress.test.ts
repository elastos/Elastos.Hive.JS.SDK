import {TestData} from "./config/testdata";
import {AlreadyExistsException, VaultSubscription} from "../../src";

/**
 * Please run this file in mainnet
 * TODO: move initialize to getProviderAddress before run.
 */

describe.skip("test service without provider address", () => {
    test("testDatabaseServiceWithoutProviderAddress", async () => {
        const testData = await TestData.getInstance("vault subscribe.test");
        const vaultSubscription = new VaultSubscription(
            testData.getUserAppContext(),
            testData.getProviderAddress());
        try {
            await vaultSubscription.subscribe();
        } catch (e) {
            if (!(e instanceof AlreadyExistsException)) {
                throw e;
            }
        }
    });
});
