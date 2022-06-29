import {TestData} from "./config/testdata";

/**
 * Please run this file with a prod hive node.
 */

describe.skip("test appcontext", () => {
    beforeAll(() => {
    });

    test("testGetProviderAddress", async () => {
        let testData = await TestData.getInstance("databaseservice.tests");
        const providerAddress = await testData.getUserAppContext().setUserDidForceResolveFlag(true).getProviderAddress();
        console.log(`Provider address: ${providerAddress}`);
        expect(providerAddress).not.toBeUndefined();
        expect(providerAddress).toEqual<string>('https://hive1.trinity-tech.io');
    });
});
