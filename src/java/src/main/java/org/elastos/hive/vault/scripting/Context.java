package org.elastos.hive.vault.scripting;

import com.google.gson.annotations.SerializedName;

class Context {
	@SerializedName("target_did")
	private String targetDid;
	@SerializedName("target_app_did")
	private String targetAppDid;

	public Context setTargetDid(String targetDid) {
		this.targetDid = targetDid;
		return this;
	}

	public Context setTargetAppDid(String targetAppDid) {
		this.targetAppDid = targetAppDid;
		return this;
	}
}
