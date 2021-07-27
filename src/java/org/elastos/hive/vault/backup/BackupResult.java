package org.elastos.hive.vault.backup;

import com.google.gson.annotations.SerializedName;
import org.elastos.hive.service.BackupService;

import java.io.IOException;

class BackupResult {
	@SerializedName("state")
	private String state;

	@SerializedName("result")
	private String result;

	public BackupService.BackupResult getStatusResult() throws IOException {
		switch (state) {
			case "stop":
				return BackupService.BackupResult.STATE_STOP;
			case "backup":
				return BackupService.BackupResult.STATE_BACKUP;
			case "restore":
				return BackupService.BackupResult.STATE_RESTORE;
			default:
				throw new IOException("Unknown state :" + result);
		}
	}
}
