import { HttpClient } from "./connection/httpclient";
import { AppContext } from "./connection/auth/appcontext";
import { ServiceEndpoint } from "./connection/serviceendpoint";
import { FilesService } from "./service/files/filesservice";
import { DatabaseService } from "./service/database/databaseservice";
import { ScriptingService } from "./service/scripting/scriptingservice";
import { BackupService } from "./service/backup/backupservice";

/**
 * This class explicitly represents the vault service subscribed by "userDid".
 */
export class Vault extends ServiceEndpoint {
	private readonly filesService: FilesService;
	private readonly encryptionFilesService: FilesService;
	private readonly database: DatabaseService;
	private readonly encryptionDatabase: DatabaseService;
	private readonly scripting: ScriptingService;
	private readonly backupService: BackupService;

	public constructor(context: AppContext, providerAddress?: string) {
		super(context, providerAddress);
		let httpClient = new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
		this.filesService	        = new FilesService(this, httpClient);
		this.encryptionFilesService = new FilesService(this, httpClient, true);
		this.database		        = new DatabaseService(this, httpClient);
		this.encryptionDatabase     = new DatabaseService(this, httpClient, true);
		this.scripting	 	        = new ScriptingService(this, httpClient);
		this.backupService          = new BackupService(this, httpClient);
	}

	public getFilesService(): FilesService {
		return this.filesService;
	}

    public getEncryptionFilesService(): FilesService {
        return this.encryptionFilesService;
    }

	public getDatabaseService(): DatabaseService {
		return this.database;
	}

    public getEncryptionDatabaseService(): DatabaseService {
        return this.encryptionDatabase;
    }

	public getScriptingService(): ScriptingService {
		return this.scripting;
	}

	public getBackupService(): BackupService  {
		return this.backupService;
	}
}
