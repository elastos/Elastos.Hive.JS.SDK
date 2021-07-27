package org.elastos.hive.vault.backup;

import org.elastos.hive.connection.NodeRPCConnection;
import org.elastos.hive.connection.NodeRPCException;
import org.elastos.hive.exception.*;
import org.elastos.hive.service.BackupService;

import java.io.IOException;
import java.security.InvalidParameterException;

public class BackupController {
	private BackupAPI backupAPI;

	public BackupController(NodeRPCConnection connection) {
		backupAPI = connection.createService(BackupAPI.class, true);
	}

	public void startBackup(String credential) throws HiveException {
		try {
			backupAPI.saveToNode(new RequestParams(credential)).execute().body();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					if (e.getInternalCode() == NodeRPCException.IC_BACKUP_IS_IN_PROCESSING)
						throw new BackupIsInProcessingException(e);
					else
						throw new InvalidParameterException(e.getMessage());
				case NodeRPCException.INSUFFICIENT_STORAGE:
					throw new InsufficientStorageException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	public void restoreFrom(String credential) throws HiveException {
		try {
			backupAPI.restoreFromNode(new RequestParams(credential)).execute().body();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					if (e.getInternalCode() == NodeRPCException.IC_BACKUP_IS_IN_PROCESSING)
						throw new BackupIsInProcessingException(e);
					else
						throw new InvalidParameterException(e.getMessage());
				case NodeRPCException.INSUFFICIENT_STORAGE:
					throw new InsufficientStorageException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	public BackupService.BackupResult checkResult() throws HiveException {
		try {
			return backupAPI.getState().execute().body().getStatusResult();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}
}
