import {VaultBase} from "./vault_base";
import {BrowserConnectivitySDKHiveAuthHelper} from "./browser_helper";
import ClientConfig from "./config/clientconfig";
import {AppContext} from "@elastosfoundation/hive-js-sdk";
import {browserLogin} from "./browser_login";

/**
 * This class is used to work with essentials app in browser.
 *
 * Usage:
 *
 *      const browser = new BrowserVault();
 *      const vault = await node.createVault();
 *
 *      // create collection.
 *      await vault.getDatabaseService().createCollection(collectionName);
 *
 */
export class BrowserVault extends VaultBase {
    private helper: BrowserConnectivitySDKHiveAuthHelper;

    constructor(config: ClientConfig) {
        super(config);
        this.helper = new BrowserConnectivitySDKHiveAuthHelper(this.config['resolverUrl']);
    }

    protected async createAppContext(): Promise<AppContext> {
        return await this.helper.getAppContext(browserLogin.getUserDidStr());
    }

    public getTargetUserDid(): string {
        return browserLogin.getUserDidStr();
    }

}
