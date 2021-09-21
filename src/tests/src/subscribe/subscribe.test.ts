import { DID, DIDDocument } from "@elastosfoundation/did-js-sdk/";
import { AppContext, AppContextProvider, VaultSubscriptionService } from "../../..";
import { HttpClient } from "../../../http/httpclient";
import { Logger } from "../../../logger";


export class ApiServiceContextProvider  {
    getLocalDataDir()  {
        return "/tmp/local";
    }

    async getAppInstanceDocument()  {

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

describe("test subscribe function", () => {

  it("should return vault info", async () => {
        const p = new ApiServiceContextProvider();

        AppContext.setupResolver("mainnet", "");
        const appContext = await AppContext.build(p, "did:elastos:idS4mxWo1s5nVUdZGqzx8znVNAfzY3JG9C");
        HttpClient.DEFAULT_OPTIONS.port = 9001;
        HttpClient.LOG.setLevel(Logger.DEBUG);

        const vaultSubscriptionService = new VaultSubscriptionService(appContext, "http://localhost");
        const vaultInfo = await vaultSubscriptionService.subscribe();
    });
});


