package org.elastos.hive.vault.scripting;

import com.google.gson.annotations.SerializedName;

class RegScriptResult {
	@SerializedName("acknowledged")
	private Boolean acknowledged;
	@SerializedName("matched_count")
	private Integer matchedCount;
	@SerializedName("modified_count")
	private Integer modifiedCount;
	@SerializedName("upserted_id")
	private String upsertedId;

	public Boolean getAcknowledged() {
		return acknowledged;
	}

	public Integer getMatchedCount() {
		return matchedCount;
	}

	public Integer getModifiedCount() {
		return modifiedCount;
	}

	public String getUpsertedId() {
		return upsertedId;
	}
}
