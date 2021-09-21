import { DID, DIDDocument } from "@elastosfoundation/did-js-sdk/";
import { VaultSubscriptionService } from "../../..";
import { HttpClient } from "../../../http/httpclient";
import { Logger } from "../../../logger";
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

/*
export class ApiServiceContextProvider  {

    private testData: TestData;

    constructor(testData: TestData) {
        this.testData = testData;
    }

    getLocalDataDir()  {
        return "/home/carlduranleau/temp/local";
    }

    async getAppInstanceDocument()  {

        return this.testData.getA
        const did = new DID("did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX");
        const didDocument = await did.resolve(true);
        return didDocument;
    }
    async getAuthorization(authenticationChallengeJWtCode) {
        const did = new DID("did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX");
        const didDocument = await did.resolve(true);
        // tslint:disable-next-line:no-console
        console.log('jwtcode: ' + authenticationChallengeJWtCode)
        return authenticationChallengeJWtCode;
    }

}
*/
describe("test subscribe function", () => {

    let testData: TestData;
    let subscriptionService: VaultSubscriptionService;

    beforeEach(async () => {
        testData = await TestData.getInstance(ClientConfig.LOCAL, "/home/carlduranleau/temp");
        subscriptionService = new VaultSubscriptionService(
            testData.getAppContext(),
            testData.getProviderAddress());

    });

    it("should return vault info", async () => {
        HttpClient.DEFAULT_OPTIONS.port = 9001;
        HttpClient.LOG.setLevel(Logger.DEBUG);

        const vaultInfo = await subscriptionService.subscribe();
    });
});


