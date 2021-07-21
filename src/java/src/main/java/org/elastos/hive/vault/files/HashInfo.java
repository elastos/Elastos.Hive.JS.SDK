package org.elastos.hive.vault.files;

import com.google.gson.annotations.SerializedName;

class HashInfo {
	@SerializedName("name")
	private String name;

	@SerializedName("algorithm")
	private String algorithm;

	@SerializedName("hash")
	private String hash;

	public String getName() {
		return name;
	}

	public String getAlgorithm() {
		return algorithm;
	}

	public String getHash() {
		return hash;
	}
}
