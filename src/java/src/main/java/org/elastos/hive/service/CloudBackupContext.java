package org.elastos.hive.service;

public abstract class CloudBackupContext implements BackupContext {
	@Override
	public String getParameter(String parameter) {
		switch (parameter) {
			case "clientId":
				return getClientId();

			case "redirectUrl":
				return getRedirectUrl();

			case "scope":
				return getAppScope();

			default:
				break;
		}

		return null;
	}

	public abstract String getClientId();
	public abstract String getRedirectUrl();
	public abstract String getAppScope();
}
