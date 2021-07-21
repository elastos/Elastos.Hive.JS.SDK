package org.elastos.hive;

import org.elastos.hive.service.*;
import org.elastos.hive.vault.ServiceBuilder;

/**
 * This class explicitly represents the vault service subscribed by "userDid".
 */
public class Vault extends ServiceEndpoint {
	private FilesService 	filesService;
	private DatabaseService database;
	private ScriptingService scripting;
	private BackupService 	backupService;

	public Vault(AppContext context, String providerAddress) {
		super(context, providerAddress);

		ServiceBuilder builder = new ServiceBuilder(this);
		this.filesService	= builder.createFilesService();
		this.database		= builder.createDatabase();
		this.scripting	 	= builder.createScriptingService();
		this.backupService  = builder.createBackupService();
	}

	public FilesService getFilesService() {
		return this.filesService;
	}

	public DatabaseService getDatabaseService() {
		return this.database;
	}

	public ScriptingService getScriptingService() {
		return this.scripting;
	}

	public BackupService getBackupService() {
		return this.backupService;
	}
}
