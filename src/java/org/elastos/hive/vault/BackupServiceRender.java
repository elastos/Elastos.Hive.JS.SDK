package org.elastos.hive.vault;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

import org.elastos.hive.ServiceContext;
import org.elastos.hive.exception.HiveException;
import org.elastos.hive.exception.NotImplementedException;
import org.elastos.hive.vault.backup.BackupController;
import org.elastos.hive.vault.backup.credential.CredentialCode;
import org.elastos.hive.service.BackupContext;
import org.elastos.hive.service.BackupService;

class BackupServiceRender implements BackupService {
	private ServiceContext ServiceContext;
	private BackupController controller;
	private CredentialCode credentialCode;

	public BackupServiceRender(ServiceContext ServiceContext) {
		this.ServiceContext = ServiceContext;
		this.controller = new BackupController(ServiceContext);
	}

	@Override
	public CompletableFuture<Void> setupContext(BackupContext backupContext) {
		this.credentialCode = new CredentialCode(ServiceContext, backupContext);
		return CompletableFuture.runAsync(() -> {
			return;
		});
	}

	@Override
	public CompletableFuture<Void> startBackup() {
		return CompletableFuture.runAsync(() -> {
			try {
				controller.startBackup(credentialCode.getToken());
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Void> stopBackup() {
		return CompletableFuture.runAsync(() -> {
			throw new NotImplementedException();
		});
	}

	@Override
	public CompletableFuture<Void> restoreFrom() {
		return CompletableFuture.runAsync(() -> {
			try {
				controller.restoreFrom(credentialCode.getToken());
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Void> stopRestore() {
		return CompletableFuture.runAsync(() -> {
			throw new NotImplementedException();
		});
	}

	@Override
	public CompletableFuture<BackupResult> checkResult() {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return controller.checkResult();
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}
}
