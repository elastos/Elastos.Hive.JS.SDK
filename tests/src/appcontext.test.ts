import {DefaultDIDAdapter, DIDBackend} from "@elastosfoundation/did-js-sdk";
import {AppContext} from "@elastosfoundation/hive-js-sdk";

describe.skip("test appcontext", () => {
    beforeAll(() => {
    });

    test("testGetProviderAddress", async () => {
        // TODO: move initialize to getProviderAddress before run.
        DIDBackend.initialize(new DefaultDIDAdapter('mainnet'));
        const providerAddress = await AppContext.getProviderAddress(
            "did:elastos:ikkFHgoUHrVDTU8HTYDAWH9Z8S377Qvt7n");
        console.log(`Provider address: ${providerAddress}`);
        expect(providerAddress).not.toBeUndefined();
    });
});
