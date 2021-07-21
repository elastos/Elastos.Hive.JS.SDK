package org.elastos.hive.service;

import java.util.concurrent.CompletableFuture;

/**
 * Backup service is for doing backup vault data from vault node server to backup server.
 * Backup server maybe another node server or third-party centered server like Google Driver.
 * As a restrict, only one vault can be used for one DID.
 * User also need just one backup copy for vault data.
 */
public interface BackupService {
	enum BackupResult {
		STATE_STOP,
		STATE_BACKUP,
		STATE_RESTORE,
	}

	/**
	 * Set-up a context for get more detailed information for backup server.
	 *
	 * @param context context for providing backup server details.
	 * @return Void
	 */
	CompletableFuture<Void> setupContext(BackupContext context);

	/**
	 * Backup process in node side is a continues process. Vault node server backup whole vault data to
	 * backup server and keep syncing with it. This is for user personal data security.
	 * This function is for starting a background scheduler to update data to backup server. It's an
	 * async process.
	 *
	 * @return Void
	 */
	CompletableFuture<Void> startBackup();

	/**
	 * As startBackup() shows, this is just for stopping the async process in vault node side.
	 *
	 * @return Void
	 */
	CompletableFuture<Void> stopBackup();

	/**
	 * This is for restore vault data from backup server only once.
	 * The action is processed async in node side.
	 *
	 * @return Void
	 */
	CompletableFuture<Void> restoreFrom();

	/**
	 * Stop the running restore process in background.
	 *
	 * @return Void
	 */
	CompletableFuture<Void> stopRestore();

	/**
	 * Check the current status of the node side backup process.
	 *
	 * @return Void
	 */
	CompletableFuture<BackupResult> checkResult();
}
