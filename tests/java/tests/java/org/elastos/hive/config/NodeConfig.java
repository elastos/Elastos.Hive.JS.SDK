package org.elastos.hive.config;

import com.fasterxml.jackson.annotation.JsonProperty;

public class NodeConfig extends Config {
	@JsonProperty("provider")
	private String provider;
	// the service instance did of backup node.
	@JsonProperty("targetDid")
	private String targetDid;
	// the host of backup node.
	@JsonProperty("targetHost")
	private String targetHost;
	@JsonProperty("storePath")
	private String storePath;

	public String provider() {
		return this.provider;
	}

	public String targetDid() {
		return this.targetDid;
	}

	public String targetHost() {
		return this.targetHost;
	}

	public String storePath() {
		return this.storePath;
	}

	public static NodeConfig deserialize(String content) {
		return deserialize(content, NodeConfig.class);
	}
}
