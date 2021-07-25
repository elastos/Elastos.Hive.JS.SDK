import { JsonProperty } from "@elastosfoundation/jackson-js";
import { Config } from "./config"

export class NodeConfig extends Config {
	@JsonProperty("provider")
	private provider: string;
	// the service instance did of backup node.
	@JsonProperty("targetDid")
	private targetDid: string;
	// the host of backup node.
	@JsonProperty("targetHost")
	private targetHost: string
	@JsonProperty("storePath")
	private storePath: string;

	public getProvider(): string {
		return this.provider;
	}

	public getTargetDid(): string {
		return this.targetDid;
	}

	public getTargetHost(): string {
		return this.targetHost;
	}

	public getStorePath(): string {
		return this.storePath;
	}

	public static deserialize(content: string): NodeConfig {
		return super.parse(content, NodeConfig);
	}
}
