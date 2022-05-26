import {TestData} from "./config/testdata";
import {AlreadyExistsException, VaultSubscription} from "@elastosfoundation/hive-js-sdk";
import {ClientConfig} from "./config/clientconfig";

/**
 * Please run this file in mainnet
 * TODO: move initialize to getProviderAddress before run.
 */

describe.skip("test service without provider address", () => {
    test("testDatabaseServiceWithoutProviderAddress", async () => {
        const testData = await TestData.getInstance("noprovideraddress.test", ClientConfig.CUSTOM);
        const vaultSubscription = new VaultSubscription(testData.getAppContext());
        try {
            await vaultSubscription.subscribe();
        } catch (e) {
            if (!(e instanceof AlreadyExistsException)) {
                throw e;
            }
        }
    });
});
