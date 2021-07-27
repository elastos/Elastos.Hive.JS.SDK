package org.elastos.hive.vault.database;

import com.google.gson.annotations.SerializedName;

class CountResult {
	@SerializedName("count")
	private Long count;

	public Long getCount() {
		return this.count;
	}
}
