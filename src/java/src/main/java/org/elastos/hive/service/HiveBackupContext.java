package org.elastos.hive.service;

public abstract class HiveBackupContext implements BackupContext {
	@Override
	public String getParameter(String parameter) {
		switch (parameter) {
			case "targetAddress":
				return this.getTargetProviderAddress();

			case "targetServiceDid":
				return this.getTargetServiceDid();

			default:
				break;
		}
		return null;
	}

	public abstract String getTargetProviderAddress();
	public abstract String getTargetServiceDid();
}
