package org.elastos.hive.vault.backup.credential;

import org.elastos.hive.ServiceEndpoint;
import org.elastos.hive.connection.NodeRPCException;
import org.elastos.hive.connection.auth.CodeFetcher;
import org.elastos.hive.service.BackupContext;

import java.util.concurrent.ExecutionException;

class RemoteResolver implements CodeFetcher {
	private ServiceEndpoint serviceEndpoint;
	private BackupContext backupContext;
	private String targetDid;
	private String targetHost;

	public RemoteResolver(ServiceEndpoint serviceEndpoint, BackupContext backupContext,
						  String targetServiceDid, String targetAddress) {
		this.serviceEndpoint = serviceEndpoint;
		this.backupContext = backupContext;
		this.targetDid = targetServiceDid;
		this.targetHost = targetAddress;
	}

	@Override
	public String fetch() throws NodeRPCException {
		if (serviceEndpoint.getServiceInstanceDid() == null) {
			serviceEndpoint.refreshAccessToken();
		}
		try {
			return backupContext.getAuthorization(serviceEndpoint.getServiceInstanceDid(), targetDid, targetHost).get();
		} catch (InterruptedException | ExecutionException e) {
			throw new NodeRPCException(NodeRPCException.UNAUTHORIZED, -1,
					"Failed to create backup credential." + e.getCause().getMessage());
		}
	}

	@Override
	public void invalidate() {}
}
