package org.elastos.hive.vault.scripting;

import com.google.gson.annotations.SerializedName;

class RegScriptParams {
	@SerializedName("executable")
	private Executable executable;
	@SerializedName("allowAnonymousUser")
	private Boolean allowAnonymousUser;
	@SerializedName("allowAnonymousApp")
	private Boolean allowAnonymousApp;
	@SerializedName("condition")
	private Condition condition;

	public RegScriptParams setExecutable(Executable executable) {
		this.executable = executable;
		return this;
	}

	public RegScriptParams setAllowAnonymousUser(Boolean allowAnonymousUser) {
		this.allowAnonymousUser = allowAnonymousUser;
		return this;
	}

	public RegScriptParams setAllowAnonymousApp(Boolean allowAnonymousApp) {
		this.allowAnonymousApp = allowAnonymousApp;
		return this;
	}

	public RegScriptParams setCondition(Condition condition) {
		this.condition = condition;
		return this;
	}
}
