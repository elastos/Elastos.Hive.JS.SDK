import {DefaultDIDAdapter, DIDBackend} from "@elastosfoundation/did-js-sdk";
import {AppContext} from "../../src";

/**
 * Please run this file with a prod hive node.
 * TODO: move initialize to getProviderAddress before run.
 */

describe.skip("test appcontext", () => {
    beforeAll(() => {
    });

    test("testGetProviderAddress", async () => {
        DIDBackend.initialize(new DefaultDIDAdapter('mainnet'));
        const providerAddress = await AppContext.getProviderAddress("did:elastos:imedtHyjLS155Gedhv7vKP3FTWjpBUAUm4");
        console.log(`Provider address: ${providerAddress}`);
        expect(providerAddress).not.toBeUndefined();
        expect(providerAddress).not.toBe('https://hive1.trinity-tech.io');
    });
});
