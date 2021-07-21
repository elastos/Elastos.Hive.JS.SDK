package org.elastos.hive.vault.database;

import com.google.gson.annotations.SerializedName;

public class UpdateResult {
	private Boolean acknowledged;
	@SerializedName("matched_count")
	private Integer matchedCount;
	@SerializedName("modified_count")
	private Integer modifiedCount;
	@SerializedName("upserted_id")
	private String upsertedId;

	public void setAcknowledged(Boolean acknowledged) {
		this.acknowledged = acknowledged;
	}

	public void setMatchedCount(Integer matchedCount) {
		this.matchedCount = matchedCount;
	}

	public void setModifiedCount(Integer modifiedCount) {
		this.modifiedCount = modifiedCount;
	}

	public void setUpsertedId(String upsertedId) {
		this.upsertedId = upsertedId;
	}

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
