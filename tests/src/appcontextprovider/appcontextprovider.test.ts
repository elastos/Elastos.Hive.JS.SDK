import { AppContextParameters, AppContext, DefaultAppContextProvider, VaultSubscription} from "../../../src";
import {TestData} from "../config/testdata";
import {AppDID} from "../did/appdid";

describe.skip("test default appcontext provider", () => {
   
    let testData: TestData;
    let vaultSubscription: VaultSubscription;
    
    beforeAll(async() => {
        testData = await TestData.getInstance("appcontextprovider.test");
        let clientConfig = testData.getClientConfig();

        let appContextParameters = {
            storePath: `${process.env["HIVE_USER_DIR"]}/data/store/app`,
            appDID: clientConfig.application.did, 
            appMnemonics: clientConfig.application.mnemonics2, 
            appPhrasePass: clientConfig.application.passPhrase,
            appStorePass: clientConfig.application.storepass,
            userDID: clientConfig.user.did, 
            userMnemonics: clientConfig.user.mnemonic,
            userPhrasePass: clientConfig.user.passPhrase,
            userStorePass: clientConfig.user.storepass
        } as AppContextParameters;

        try{
            let appProvider = await DefaultAppContextProvider.create(appContextParameters);
            let appContext = await AppContext.build(appProvider, appContextParameters.userDID as string, AppDID.APP_DID);
            vaultSubscription = new VaultSubscription(appContext, clientConfig.node.targetHost);
        } catch(e){
            console.debug(e);
            throw e;
        }

        try {
            await vaultSubscription.unsubscribe();
        } catch (e) {
            // Prevent an error on already subscribed vault
        }
    });

    test("testValidProvider", async () => {
        await vaultSubscription.subscribe();
    });

});