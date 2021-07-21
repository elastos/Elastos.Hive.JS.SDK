package org.elastos.hive.config;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CrossConfig extends Config {
	@JsonProperty("application")
	private ApplicationConfig applicationConfig;
	@JsonProperty("user")
	private UserConfig userConfig;
	@JsonProperty("crossDid")
	private String crossDid;

	public ApplicationConfig applicationConfig() {
		return this.applicationConfig;
	}

	public UserConfig userConfig() {
		return this.userConfig;
	}

	public String crossDid() {
		return this.crossDid;
	}

	public static CrossConfig deserialize(String content) {
		return deserialize(content, CrossConfig.class);
	}
}
