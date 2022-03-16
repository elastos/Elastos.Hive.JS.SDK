import { AppContextParameters, AppContext, DefaultAppContextProvider, VaultSubscriptionService} from "@elastosfoundation/hive-js-sdk";
import {TestData} from "../config/testdata";



describe("test default appcontext provider", () => {
   
    let vaultSubscriptionService: VaultSubscriptionService;
    
    beforeAll(async() => {
        const testData = await TestData.getInstance("appcontextprovider.test");
        const clientConfig = testData.getClientConfig();

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
            vaultSubscriptionService = new VaultSubscriptionService(appContext, clientConfig.node.targetHost);
        } catch(e){
            console.debug(e);
            fail("failed");
        }
    });

    test("test", async () => {
        try {
            await vaultSubscriptionService.subscribe();
        } catch(e) {
            console.debug("error on subscribe:" +e);
        }
    });

});