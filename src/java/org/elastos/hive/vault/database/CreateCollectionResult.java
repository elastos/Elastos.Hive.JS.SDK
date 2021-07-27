package org.elastos.hive.vault.database;

import com.google.gson.annotations.SerializedName;

class CreateCollectionResult {
	@SerializedName("name")
	private String name;

	public String getName() {
		return name;
	}
}
