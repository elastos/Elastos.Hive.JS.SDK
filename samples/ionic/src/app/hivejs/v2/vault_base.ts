import {AppContext, VaultServices, VaultSubscriptionService} from "@elastosfoundation/hive-js-sdk";
import ClientConfig from "../config/clientconfig";


export abstract class VaultBase {
    protected readonly config: ClientConfig;

    protected constructor(config: ClientConfig) {
        this.config = config;
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

    public abstract getTargetAppDid(): string;
}
