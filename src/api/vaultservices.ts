import { HttpClient } from "../http/httpclient";
import { AppContext } from "../http/security/appcontext";
import { ServiceContext } from "../http/servicecontext";
import { FilesService } from "../restclient/files/filesservice";
import { DatabaseService } from "../restclient/database/databaseservice";
import { ScriptingService } from "../restclient/scripting/scriptingservice";
import { BackupService } from "../restclient/backup/backupservice";
import { PromotionService } from "..";

/**
 * This class explicitly represents the vault service subscribed by "userDid".
 */
 export class VaultServices extends ServiceContext {
	private filesService: FilesService;
	private database: DatabaseService;
	private scripting: ScriptingService;
	private backupService: BackupService;
	private promotionService: PromotionService;

	public constructor(context: AppContext, providerAddress: string) {
		super(context, providerAddress);
		let httpClient = new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
		this.filesService	= new FilesService(this, httpClient);
		this.database		= new DatabaseService(this, httpClient);
		this.scripting	 	= new ScriptingService(this, httpClient);
		this.backupService  = new BackupService(this, httpClient);
		this.promotionService  = new PromotionService(this, httpClient);
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

	public getPromotionService(): PromotionService  {
		return this.promotionService;
	}
}
