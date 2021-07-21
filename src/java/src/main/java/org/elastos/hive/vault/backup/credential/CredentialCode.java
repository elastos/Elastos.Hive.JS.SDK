package org.elastos.hive.vault.backup.credential;

import org.elastos.hive.DataStorage;
import org.elastos.hive.ServiceEndpoint;
import org.elastos.hive.connection.NodeRPCException;
import org.elastos.hive.connection.auth.CodeFetcher;
import org.elastos.hive.exception.HiveException;
import org.elastos.hive.service.BackupContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CredentialCode {
	private static final Logger log = LoggerFactory.getLogger(CredentialCode.class);
	private String targetServiceDid;
	private String jwtCode;
	private CodeFetcher remoteResolver;
	private DataStorage storage;

	public CredentialCode(ServiceEndpoint endpoint, BackupContext context) {
		targetServiceDid = context.getParameter("targetServiceDid");
		CodeFetcher remoteResolver = new RemoteResolver(
				endpoint, context, targetServiceDid, context.getParameter("targetAddress"));
		this.remoteResolver = new LocalResolver(endpoint, remoteResolver);
		storage = endpoint.getStorage();
	}

	public String getToken() throws HiveException {
		if (jwtCode != null)
			return jwtCode;

		jwtCode = restoreToken();
		if (jwtCode == null) {
			try {
				jwtCode = remoteResolver.fetch();
			} catch (NodeRPCException e) {
				throw new HiveException(e.getMessage());
			}

			if (jwtCode != null) {
				saveToken(jwtCode);
			}
		}
		return jwtCode;
	}

	private String restoreToken() {
		return storage.loadBackupCredential(targetServiceDid);
	}

	private void saveToken(String jwtCode) {
		storage.storeBackupCredential(targetServiceDid, jwtCode);
	}
}
