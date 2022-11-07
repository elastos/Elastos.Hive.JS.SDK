import {AppContext} from "./connection/auth/appcontext";
import {ServiceEndpoint} from "./connection/serviceendpoint";
import {FilesService} from "./service/files/filesservice";
import {DatabaseService} from "./service/database/databaseservice";
import {ScriptingService} from "./service/scripting/scriptingservice";
import {BackupService} from "./service/backup/backupservice";
import {checkArgument} from "./utils/utils";
import {InvalidParameterException} from "./exceptions";
import {EncryptionFilesService} from "./service/files/encryption.filesservice";
import {EncryptionDatabaseService} from "./service/database/encryption.databaseservice";
import {AppInfo} from "./service/subscription/appinfo";
import {SubscriptionAPI} from "./service/subscription/subscriptionapi";
import {RestServiceT} from "./service/restservice";

/**
 * This class explicitly represents the vault service subscribed by "userDid".
 */
export class Vault extends RestServiceT<SubscriptionAPI> {
    private static readonly DATABASE_NONCE = Buffer.from('404142434445464748494a4b4c4d4e4f5051525354555657', 'hex');

    private readonly filesService: FilesService;
    private encryptionFiles: FilesService;
    private readonly databaseService: DatabaseService;
    private encryptionDatabase: DatabaseService;
    private readonly scripting: ScriptingService;
    private readonly backupService: BackupService;

    constructor(context: AppContext, providerAddress?: string) {
        super(new ServiceEndpoint(context, providerAddress));
        this.filesService = new FilesService(this.getServiceContext());
        this.encryptionFiles = null;
        this.databaseService = new DatabaseService(this.getServiceContext());
        this.encryptionDatabase = null;
        this.scripting = new ScriptingService(this.getServiceContext());
        this.backupService = new BackupService(this.getServiceContext());
    }

    async setEncryption(storepass: string): Promise<Vault> {
        checkArgument(!!storepass, 'Invalid storepass');

        if (!this.encryptionFiles) {
            const service = new EncryptionFilesService(this.getServiceContext());
            await service.encryptionInit(this.getServiceContext().getAppContext().getAppDid(), 0, storepass);
            this.encryptionFiles = service;
        }
        if (!this.encryptionDatabase) {
            const service = new EncryptionDatabaseService(this.getServiceContext());
            await service.encryptionInit(this.getServiceContext().getAppContext().getAppDid(), 0, storepass,
                Vault.DATABASE_NONCE);
            this.encryptionDatabase = service;
        }

        return this;
    }

    getFilesService(encrypt=false): FilesService {
        if (encrypt && !this.encryptionFiles)
            throw new InvalidParameterException(`Encryption need set first.`);
        return encrypt ? this.encryptionFiles : this.filesService;
    }

    getDatabaseService(encrypt=false): DatabaseService {
        if (encrypt && !this.encryptionDatabase)
            throw new InvalidParameterException(`Encryption need set first.`);
        return encrypt ? this.encryptionDatabase : this.databaseService;
    }

    getScriptingService(): ScriptingService {
        return this.scripting;
    }

    getBackupService(): BackupService {
        return this.backupService;
    }

    /**
     * Get the details of the vault applications.
     *
     * @return The details of the vault applications.
     * @throws HiveException The error comes from the hive node.
     */
    async getAppStats(): Promise<AppInfo[]> {
        return await this.callAPI(SubscriptionAPI, async api => {
            return await api.getVaultAppStats(await this.getAccessToken());
        });
    }
}
