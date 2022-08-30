import {AppContext} from "../../src";

/**
 * Please run this file with a prod hive node.
 */

describe.skip("test appcontext", () => {
    beforeAll(() => {});

    test("testGetProviderAddress", async () => {
        const userDid = 'did:elastos:imedtHyjLS155Gedhv7vKP3FTWjpBUAUm4';
        const providerAddress = await AppContext.getProviderAddressByUserDid(userDid, null, true);
        console.log(`Provider address: ${providerAddress}`);
        expect(providerAddress).not.toBeUndefined();
        expect(providerAddress).not.toBe('https://hive1.trinity-tech.io');
    });
});
