import {TestData} from "./config/testdata";
import {AlreadyExistsException, VaultSubscription} from "@elastosfoundation/hive-js-sdk";
import {DefaultDIDAdapter, DIDBackend} from "@elastosfoundation/did-js-sdk";

/**
 * Please run this file in mainnet
 * TODO: move initialize to getProviderAddress before run.
 */

describe.skip("test service without provider address", () => {
    beforeAll(() => {
    });

    test("testDatabaseServiceWithoutProviderAddress", async () => {
        DIDBackend.initialize(new DefaultDIDAdapter('mainnet'));
        const testData = await TestData.getInstance("databaseservice.tests");
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
