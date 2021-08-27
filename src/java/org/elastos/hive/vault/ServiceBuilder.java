package org.elastos.hive.vault;

import org.elastos.hive.ServiceContext;
import org.elastos.hive.service.BackupService;
import org.elastos.hive.service.DatabaseService;
import org.elastos.hive.service.FilesService;
import org.elastos.hive.service.ScriptingService;

public class ServiceBuilder {
	private ServiceContext ServiceContext;

	public ServiceBuilder(ServiceContext ServiceContext) {
		this.ServiceContext = ServiceContext;
	}

	public FilesService createFilesService() {
		return new FilesServiceRender(ServiceContext);
	}

	public DatabaseService createDatabase() {
		return new DatabaseServiceRender(ServiceContext);
	}

	public ScriptingService createScriptingService() {
		return new ScriptingServiceRender(ServiceContext);
	}

	public BackupService createBackupService() {
		return new BackupServiceRender(ServiceContext);
	}
}
