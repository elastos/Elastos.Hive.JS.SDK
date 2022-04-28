import { HttpClient } from "./connection/httpclient";
import { AppContext } from "./connection/auth/appcontext";
import { ServiceEndpoint } from "./connection/serviceEndpoint";
import { FilesService } from "./service/files/filesservice";
import { DatabaseService } from "./service/database/databaseservice";
import { ScriptingService } from "./service/scripting/scriptingservice";
import { BackupService } from "./service/backup/backupservice";

/**
 * This class explicitly represents the vault service subscribed by "userDid".
 */
 export class Vault extends ServiceEndpoint {
	private filesService: FilesService;
	private database: DatabaseService;
	private scripting: ScriptingService;
	private backupService: BackupService;

	public constructor(context: AppContext, providerAddress?: string) {
		super(context, providerAddress);
		let httpClient = new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
		this.filesService	= new FilesService(this, httpClient);
		this.database		= new DatabaseService(this, httpClient);
		this.scripting	 	= new ScriptingService(this, httpClient);
		this.backupService  = new BackupService(this, httpClient);
	}

	public getFilesService(): FilesService {
		return this.filesService;
	}

	public getDatabaseService(): DatabaseService {
		return this.database;
	}

	public getScriptingService(): ScriptingService {
		return this.scripting;
	}

	public getBackupService(): BackupService  {
		return this.backupService;
	}
}
