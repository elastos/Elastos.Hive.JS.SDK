package org.elastos.hive.vault.database;

import com.google.gson.annotations.SerializedName;

public class CountOptions {
	@SerializedName("skip")
	private Long skip;

	@SerializedName("limit")
	private Long limit;

	@SerializedName("maxTimeMS")
	private Long maxTimeMS;

	public CountOptions setSkip(Long skip) {
		this.skip = skip;
		return this;
	}

	public CountOptions setLimit(Long limit) {
		this.limit = limit;
		return this;
	}

	public CountOptions setMaxTimeMS(Long maxTimeMS) {
		this.maxTimeMS = maxTimeMS;
		return this;
	}

	public Long getSkip() {
		return skip;
	}

	public Long getLimit() {
		return limit;
	}

	public Long getMaxTimeMS() {
		return maxTimeMS;
	}
}
