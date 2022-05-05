import {VaultBase} from "./vault_base";
import {BrowserConnectivitySDKHiveAuthHelper} from "./browser_helper";
import ClientConfig from "../config/clientconfig";
import {AppContext} from "@elastosfoundation/hive-js-sdk";
import {browserLogin} from "./browser_login";
import {AppDID} from "../did/appdid";


export class BrowserVault extends VaultBase {
    private helper: BrowserConnectivitySDKHiveAuthHelper;

    constructor(config: ClientConfig) {
        super(config);
        this.helper = new BrowserConnectivitySDKHiveAuthHelper(this.config['resolverUrl']);
    }

    protected async createAppContext(): Promise<AppContext> {
        return await this.helper.getAppContext(browserLogin.getUserDidStr());
    }

    public getTargetAppDid(): string {
        return browserLogin.getUserDidStr();
    }

    public getTargetUserDid(): string {
        return AppDID.APP_DID;
    }

}
