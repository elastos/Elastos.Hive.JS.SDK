import {
    AppContext,
    Backup, BackupService,
    BackupSubscription,
    Vault,
    VaultSubscription
} from "@elastosfoundation/hive-js-sdk";
import ClientConfig from "./config/clientconfig";
import {AppDID} from "./did/appdid";


export abstract class VaultBase {
    // hive node service did on localhost.
    // used for backup on local
    protected static LOCALHOST_SERVICE_DID = 'did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR';

    protected readonly config: ClientConfig;

    protected constructor() {
        this.config = ClientConfig.getCurrent();
    }

    async createVault(): Promise<Vault> {
        return new Vault(await this.createAppContext(), this.config['node']['provider']);
    }

    async createBackup(): Promise<Backup> {
        return new Backup(await this.createAppContext(), this.config['node']['provider']);
    }

    async createVaultSubscription(): Promise<VaultSubscription> {
        return new VaultSubscription(await this.createAppContext(), this.config['node']['provider']);
    }

    async createBackupSubscription(): Promise<BackupSubscription> {
        return new BackupSubscription(await this.createAppContext(), this.config['node']['provider']);
    }

    protected async createAppContext(): Promise<AppContext> {
        return await new Promise(() => {
            throw new Error("Method not implemented.");
        });
    }

    // for scripting
    abstract getTargetUserDid(): string;

    // for scripting
    getTargetAppDid(): string {
        return AppDID.APP_DID;
    }

    abstract getBackupService(vault: Vault): BackupService;
}
