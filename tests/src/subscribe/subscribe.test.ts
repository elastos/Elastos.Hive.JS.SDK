import { HttpClient, Logger, VaultSubscriptionService } from "@dchagastelles/elastos-hive-js-sdk/"
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

describe("test subscribe function", () => {

    let testData: TestData;
    let subscriptionService: VaultSubscriptionService;

    beforeEach(async () => {
        testData = await TestData.getInstance(ClientConfig.DEV, "/home/diego/temp");
        subscriptionService = new VaultSubscriptionService(
            testData.getAppContext(),
            testData.getProviderAddress());
    });

    test("should return vault info", async () => {
        HttpClient.DEFAULT_OPTIONS.port = 9001;
        HttpClient.LOG.setLevel(Logger.DEBUG);

        const vaultInfo = await subscriptionService.subscribe();
    });
});


