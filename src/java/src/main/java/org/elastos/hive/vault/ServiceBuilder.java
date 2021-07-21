package org.elastos.hive.vault;

import org.elastos.hive.ServiceEndpoint;
import org.elastos.hive.service.BackupService;
import org.elastos.hive.service.DatabaseService;
import org.elastos.hive.service.FilesService;
import org.elastos.hive.service.ScriptingService;

public class ServiceBuilder {
	private ServiceEndpoint serviceEndpoint;

	public ServiceBuilder(ServiceEndpoint serviceEndpoint) {
		this.serviceEndpoint = serviceEndpoint;
	}

	public FilesService createFilesService() {
		return new FilesServiceRender(serviceEndpoint);
	}

	public DatabaseService createDatabase() {
		return new DatabaseServiceRender(serviceEndpoint);
	}

	public ScriptingService createScriptingService() {
		return new ScriptingServiceRender(serviceEndpoint);
	}

	public BackupService createBackupService() {
		return new BackupServiceRender(serviceEndpoint);
	}
}
