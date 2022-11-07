import {AppContext} from "./connection/auth/appcontext";
import {ServiceEndpoint} from "./connection/serviceendpoint";
import {FilesService} from "./service/files/filesservice";
import {DatabaseService} from "./service/database/databaseservice";
import {ScriptingService} from "./service/scripting/scriptingservice";
import {BackupService} from "./service/backup/backupservice";
import {checkArgument} from "./utils/utils";
import {InvalidParameterException} from "./exceptions";
import {EncryptionFilesservice} from "./service/files/encryption.filesservice";
import {EncryptionDatabaseService} from "./service/database/encryption.databaseservice";

/**
 * This class explicitly represents the vault service subscribed by "userDid".
 */
export class Vault extends ServiceEndpoint {
    private static readonly DATABASE_NONCE = Buffer.from('404142434445464748494a4b4c4d4e4f5051525354555657', 'hex');

    private readonly filesService: FilesService;
    private encryptionFiles: FilesService;
    private readonly databaseService: DatabaseService;
    private encryptionDatabase: DatabaseService;
    private readonly scripting: ScriptingService;
    private readonly backupService: BackupService;

    constructor(context: AppContext, providerAddress?: string) {
        super(context, providerAddress);
        this.filesService = new FilesService(this);
        this.encryptionFiles = null;
        this.databaseService = new DatabaseService(this);
        this.encryptionDatabase = null;
        this.scripting = new ScriptingService(this);
        this.backupService = new BackupService(this);
    }

    async setEncryption(storepass: string): Promise<Vault> {
        checkArgument(!!storepass, 'Invalid storepass');

        if (!this.encryptionFiles) {
            const service = new EncryptionFilesservice(this);
            await service.encryptionInit(this.getAppContext().getAppDid(), 0, storepass);
            this.encryptionFiles = service;
        }
        if (!this.encryptionDatabase) {
            const service = new EncryptionDatabaseService(this);
            await service.encryptionInit(this.getAppContext().getAppDid(), 0, storepass,
                Vault.DATABASE_NONCE);
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
}
