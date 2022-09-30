import { AppContext } from "./connection/auth/appcontext";
import { ServiceEndpoint } from "./connection/serviceendpoint";
import { FilesService } from "./service/files/filesservice";
import { DatabaseService } from "./service/database/databaseservice";
import { ScriptingService } from "./service/scripting/scriptingservice";
import { BackupService } from "./service/backup/backupservice";
import { checkArgument } from "./utils/utils";

/**
 * This class explicitly represents the vault service subscribed by "userDid".
 */
export class Vault extends ServiceEndpoint {
    private readonly httpClient;
	private readonly filesService: FilesService;
	private encryptionFilesService: FilesService;
	private readonly database: DatabaseService;
	private encryptionDatabase: DatabaseService;
	private readonly scripting: ScriptingService;
	private readonly backupService: BackupService;

	public constructor(context: AppContext, providerAddress?: string) {
		super(context, providerAddress);
		this.filesService	        = new FilesService(this);
		this.encryptionFilesService = null;
		this.database		        = new DatabaseService(this);
		this.encryptionDatabase     = null;
		this.scripting	 	        = new ScriptingService(this);
		this.backupService          = new BackupService(this);
	}

	public getFilesService(): FilesService {
		return this.filesService;
	}

    public async getEncryptionFilesService(identifier: string, secureCode: number,
                                           storepass: string): Promise<FilesService> {
        checkArgument(!!identifier, 'Invalid identifier');
        checkArgument(secureCode >= 0, 'Invalid secureCode');
        checkArgument(storepass !== undefined && storepass !== null, 'Invalid storepass');

        if (!this.encryptionFilesService) {
            this.encryptionFilesService = new FilesService(this);
            await this.encryptionFilesService.encryptionInit(identifier, secureCode, storepass);
        }
        return this.encryptionFilesService;
    }

	public getDatabaseService(): DatabaseService {
		return this.database;
	}

    public async getEncryptionDatabaseService(identifier: string, secureCode: number,
                                              storepass: string, nonce: Buffer): Promise<DatabaseService> {
        checkArgument(!!identifier, 'Invalid identifier');
        checkArgument(secureCode >= 0, 'Invalid secureCode');
        checkArgument(storepass !== undefined && storepass !== null, 'Invalid storepass');
        checkArgument(!!nonce, 'Invalid nonce');

	    if (!this.encryptionDatabase) {
	        this.encryptionDatabase = new DatabaseService(this);
            await this.encryptionDatabase.encryptionInit(identifier, secureCode, storepass, nonce);
        }
        return this.encryptionDatabase;
    }

	public getScriptingService(): ScriptingService {
		return this.scripting;
	}

	public getBackupService(): BackupService  {
		return this.backupService;
	}
}
