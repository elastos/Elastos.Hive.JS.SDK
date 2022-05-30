import { AppContextParameters, AppContext, DefaultAppContextProvider, VaultSubscription} from "../../../src";
import {TestData} from "../config/testdata";



describe("test default appcontext provider", () => {
   
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
            let appContext = await AppContext.build(appProvider, appContextParameters.userDID as string);
            vaultSubscription = new VaultSubscription(appContext, clientConfig.node.targetHost);
        } catch(e){
            console.debug(e);
            throw e;
        }
    });

    test.skip("test", async () => {
        try {
            await vaultSubscription.subscribe();
        } catch(e) {
            console.debug("error on subscribe:" +e);
        }
    });

});