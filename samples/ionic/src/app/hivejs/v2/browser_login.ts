import {EssentialsConnector} from "@elastosfoundation/essentials-connector-client-browser";
import {connectivity, DID} from "@elastosfoundation/elastos-connectivity-sdk-js";
import {AppDID} from "../did/appdid";

class BrowserLogin {
    private static readonly KEY_USER_DID = 'user_did';
    private readonly essentialsConnector: EssentialsConnector;
    private connectivityInitialized: boolean

    constructor() {
        this.essentialsConnector = new EssentialsConnector();
        this.connectivityInitialized = false;
    }

    /**
     * Used for every page initialize.
     */
    async useConnectivitySDK(): Promise<void> {
        if (this.connectivityInitialized)
            return;

        this.connectivityInitialized = true;
        connectivity.setApplicationDID(AppDID.APP_DID);
        await connectivity.registerConnector(this.essentialsConnector).then(async () => {
            const walletConnectProvider = this.essentialsConnector.getWalletConnectProvider();
            if (!walletConnectProvider.connected)
                await walletConnectProvider.enable();
        });
    }

    isUsingEssentialsConnector(): boolean {
        const activeConnector = connectivity.getActiveConnector();
        return activeConnector && activeConnector.name === this.essentialsConnector.name;
    }

    private isLogined(): boolean {
        return !!this.getUserDidStr();
    }

    public getUserDidStr(): string {
        return localStorage.getItem(BrowserLogin.KEY_USER_DID);
    }

    /**
     * Used to user the did from essentials app.
     */
    async login(): Promise<void> {
        if (this.isLogined())
            return

        let presentation = null;

        try {
            const request = {claims: [DID.simpleIdClaim("Your name", "name", false)]}
            presentation = await new DID.DIDAccess().requestCredentials(request);
        } catch (e) {
            // Possible exception while using wallet connect (i.e. not an identity wallet)
            // Kill the wallet connect session
            console.warn("Error while getting credentials", e);
            try {
                await this.essentialsConnector.getWalletConnectProvider().disconnect();
            } catch (e) {
                console.error("Error while trying to disconnect wallet connect session", e);
            }
            return;
        }

        if (presentation) {
            const did = presentation.getHolder().getMethodSpecificId();
            localStorage.setItem(BrowserLogin.KEY_USER_DID, `did:elastos:${did}`);
            console.log(`logined with user did: ${did}`);
        }

        console.log('>>>>>> Login successfully.');
    }

    async initAndLogin(): Promise<void> {
        await this.useConnectivitySDK();
        await this.login();
    }
}

export const browserLogin = new BrowserLogin();
