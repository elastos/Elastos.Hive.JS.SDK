package org.elastos.hive.vault.backup;

import com.google.gson.annotations.SerializedName;

class RequestParams {
	@SerializedName("credential")
	private String credential;

	public RequestParams(String credential) {
		this.credential = credential;
	}
}
