package org.elastos.hive.vault.database;

import com.fasterxml.jackson.annotation.JsonProperty;

class DeleteResult {
	@JsonProperty("deleted_count")
	private int deletedCount;

	public int deletedCount() {
		return deletedCount;
	}
}
