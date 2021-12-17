package org.elastos.hive.vault.backup.credential;

import org.elastos.hive.ServiceContext;
import org.elastos.hive.connection.NodeRPCException;
import org.elastos.hive.connection.auth.CodeFetcher;
import org.elastos.hive.service.BackupContext;

import java.util.concurrent.ExecutionException;

class RemoteResolver implements CodeFetcher {
	private ServiceContext ServiceContext;
	private BackupContext backupContext;
	private String targetDid;
	private String targetHost;

	public RemoteResolver(ServiceContext ServiceContext, BackupContext backupContext,
						  String targetServiceDid, String targetAddress) {
		this.ServiceContext = ServiceContext;
		this.backupContext = backupContext;
		this.targetDid = targetServiceDid;
		this.targetHost = targetAddress;
	}

	@Override
	public String fetch() throws NodeRPCException {
		if (ServiceContext.getServiceInstanceDid() == null) {
			ServiceContext.refreshAccessToken();
		}
		try {
			return backupContext.getAuthorization(ServiceContext.getServiceInstanceDid(), targetDid, targetHost).get();
		} catch (InterruptedException | ExecutionException e) {
			throw NodeRPCException.forHttpCode(NodeRPCException.UNAUTHORIZED,
					"Failed to create backup credential." + e.getCause().getMessage(), -1, e);
		}
	}

	@Override
	public void invalidate() {}
}
