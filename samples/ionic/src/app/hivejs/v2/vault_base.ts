import {VaultServices, VaultSubscriptionService} from "@elastosfoundation/hive-js-sdk";


export abstract class VaultBase {
    protected constructor() {
    }

    public async createVault(): Promise<VaultServices> {
        return await new Promise(() => {
            throw new Error("Method not implemented.");
        });
    }

    public async createVaultSubscription(): Promise<VaultSubscriptionService> {
        return await new Promise(() => {
            throw new Error("Method not implemented.");
        });
    }
}
