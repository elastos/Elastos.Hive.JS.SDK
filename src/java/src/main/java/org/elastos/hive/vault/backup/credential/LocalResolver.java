package org.elastos.hive.vault.backup.credential;

import org.elastos.hive.ServiceEndpoint;
import org.elastos.hive.connection.NodeRPCException;
import org.elastos.hive.connection.auth.CodeFetcher;
import org.elastos.hive.DataStorage;

class LocalResolver implements CodeFetcher {
	private ServiceEndpoint serviceEndpoint;
	private CodeFetcher nextResolver;

	public LocalResolver(ServiceEndpoint serviceEndpoint, CodeFetcher next) {
		this.serviceEndpoint = serviceEndpoint;
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
		DataStorage storage = serviceEndpoint.getStorage();

		if (serviceEndpoint.getServiceInstanceDid() == null)
			return null;

		return storage.loadBackupCredential(serviceEndpoint.getServiceInstanceDid());
	}

	private void saveToken(String token) {
		DataStorage storage = serviceEndpoint.getStorage();

		if (serviceEndpoint.getServiceInstanceDid() != null)
			storage.storeBackupCredential(serviceEndpoint.getServiceInstanceDid(), token);
	}

	private void clearToken() {
		DataStorage storage = serviceEndpoint.getStorage();

		if (serviceEndpoint.getServiceInstanceDid() != null)
			storage.clearBackupCredential(serviceEndpoint.getServiceInstanceDid());
	}
}
