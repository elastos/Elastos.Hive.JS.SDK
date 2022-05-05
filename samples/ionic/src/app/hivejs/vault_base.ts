import {AppContext, VaultServices, VaultSubscriptionService} from "@elastosfoundation/hive-js-sdk";
import ClientConfig from "./config/clientconfig";
import {AppDID} from "./did/appdid";


export abstract class VaultBase {
    protected readonly config: ClientConfig;

    protected constructor() {
        this.config = ClientConfig.getCurrent();
    }

    public async createVault(): Promise<VaultServices> {
        return new VaultServices(await this.createAppContext(), this.config['node']['provider']);
    }

    public async createVaultSubscription(): Promise<VaultSubscriptionService> {
        return new VaultSubscriptionService(await this.createAppContext(), this.config['node']['provider']);
    }

    protected async createAppContext(): Promise<AppContext> {
        return await new Promise(() => {
            throw new Error("Method not implemented.");
        });
    }

    public abstract getTargetUserDid(): string;

    public getTargetAppDid(): string {
        return AppDID.APP_DID;
    }
}
