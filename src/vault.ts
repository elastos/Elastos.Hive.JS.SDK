import {AppContext} from "./connection/auth/appcontext";
import {ServiceEndpoint} from "./connection/serviceendpoint";
import {FilesService} from "./service/files/filesservice";
import {DatabaseService} from "./service/database/databaseservice";
import {ScriptingService} from "./service/scripting/scriptingservice";
import {BackupService} from "./service/backup/backupservice";
import {EncryptionFilesService} from "./service/files/encryption.filesservice";
import {EncryptionDatabaseService} from "./service/database/encryption.databaseservice";
import {AppInfo} from "./service/subscription/appinfo";
import {SubscriptionAPI} from "./service/subscription/subscriptionapi";
import {RestServiceT} from "./service/restservice";
import { Cipher } from "@elastosfoundation/did-js-sdk";
import {EncryptionException, InvalidParameterException} from "./exceptions";

/**
 * This class explicitly represents the vault service subscribed by "userDid".
 */
export class Vault extends RestServiceT<SubscriptionAPI> {
    private static readonly DATABASE_NONCE = Buffer.from('404142434445464748494a4b4c4d4e4f5051525354555657', 'hex');

    private readonly filesService: FilesService;
    private readonly databaseService: DatabaseService;
    private readonly scripting: ScriptingService;
    private readonly backupService: BackupService;

    private cipher: Cipher;
    private encryptedFileServcie: FilesService;
    private encryptedDBService: DatabaseService;

    constructor(context: AppContext, providerAddress?: string) {
        super(new ServiceEndpoint(context, providerAddress));
        this.filesService = new FilesService(this.getServiceContext());
        this.databaseService = new DatabaseService(this.getServiceContext());
        this.scripting = new ScriptingService(this.getServiceContext());
        this.backupService = new BackupService(this.getServiceContext());
    }

    /**
     * Enable the encrypt of this vault.
     * Only supported on the database and files services.
     *
     * @param storepass local did store password.
     */
    async enableEncryption(storepass: string) {
        if (this.cipher)
            throw new EncryptionException("Encryption ciper already being enabled.");

        try {
            let appDid = this.getServiceContext().getAppContext().getAppDid();
            this.cipher = await this.getEncryptionCipher(appDid, 0, storepass);
        } catch (error) {
            throw new EncryptionException(`Generating encryption cipher error: ${error}`)
        }
    }

    /**
     * Get the files service.
     *
     * @param encrypt Whether supports encryption.
     */
    getFilesService(encrypt = false): FilesService {
        if (encrypt && this.cipher === null)
            throw new InvalidParameterException("Encryption has not been enabled, call 'enableEncrytpion'");

        if (encrypt && !this.encryptedFileServcie)
            this.encryptedFileServcie = new EncryptionFilesService(this.getServiceContext(), this.cipher);

        return encrypt ? this.encryptedFileServcie : this.filesService;
    }

    /**
     * Get the database service.
     *
     * @param encrypt Whether supports encryption.
     */
    getDatabaseService(encrypt=false): DatabaseService {
        if (encrypt && this.cipher === null)
            throw new InvalidParameterException("Encryption has not been enabled, call 'enableEncrytpion'");

        if (encrypt && !this.encryptedDBService)
            this.encryptedDBService = new EncryptionDatabaseService(this.getServiceContext(), this.cipher, Vault.DATABASE_NONCE);

            return encrypt ? this.encryptedDBService : this.databaseService;
    }

    /**
     * Get the scripting service.
     */
    getScriptingService(): ScriptingService {
        return this.scripting;
    }

    /**
     * Get the backup service.
     */
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
