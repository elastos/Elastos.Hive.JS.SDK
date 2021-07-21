package org.elastos.hive.config;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ApplicationConfig extends Config {
	@JsonProperty("name")
	private String name;
	@JsonProperty("mnemonic")
	private String mnemonic;
	@JsonProperty("passPhrase")
	private String passPhrase;
	@JsonProperty("storepass")
	private String storepass;

	public String name() {
		return this.name;
	}

	public String mnemonic() {
		return this.mnemonic;
	}

	public String passPhrase() {
		return this.passPhrase;
	}

	public String storepass() {
		return this.storepass;
	}

	public static ApplicationConfig deserialize(String content) {
		return deserialize(content, ApplicationConfig.class);
	}
}
