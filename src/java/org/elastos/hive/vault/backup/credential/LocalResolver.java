package org.elastos.hive.vault.backup.credential;

import org.elastos.hive.ServiceContext;
import org.elastos.hive.connection.NodeRPCException;
import org.elastos.hive.connection.auth.CodeFetcher;
import org.elastos.hive.DataStorage;

class LocalResolver implements CodeFetcher {
	private ServiceContext ServiceContext;
	private CodeFetcher nextResolver;

	public LocalResolver(ServiceContext ServiceContext, CodeFetcher next) {
		this.ServiceContext = ServiceContext;
		this.nextResolver = next;
	}

	@Override
	public String fetch() throws NodeRPCException {
		String token = restoreToken();
		if (token == null) {
			token = nextResolver.fetch();
			saveToken(token);
		}

		return token;
	}

	@Override
	public void invalidate() {
		clearToken();
	}

	private String restoreToken() {
		DataStorage storage = ServiceContext.getStorage();

		if (ServiceContext.getServiceInstanceDid() == null)
			return null;

		return storage.loadBackupCredential(ServiceContext.getServiceInstanceDid());
	}

	private void saveToken(String token) {
		DataStorage storage = ServiceContext.getStorage();

		if (ServiceContext.getServiceInstanceDid() != null)
			storage.storeBackupCredential(ServiceContext.getServiceInstanceDid(), token);
	}

	private void clearToken() {
		DataStorage storage = ServiceContext.getStorage();

		if (ServiceContext.getServiceInstanceDid() != null)
			storage.clearBackupCredential(ServiceContext.getServiceInstanceDid());
	}
}
