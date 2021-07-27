package org.elastos.hive.vault.database;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class InsertResult {
	@SerializedName("acknowledged")
	private Boolean acknowledged;

	@SerializedName("inserted_ids")
	private List<String> insertedIds;

	public Boolean getAcknowledged() {
		return acknowledged;
	}

	public List<String> getInsertedIds() {
		return insertedIds;
	}
}
