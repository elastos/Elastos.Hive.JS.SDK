import { JsonProperty } from "@elastosfoundation/jackson-js";
import { ApplicationConfig } from "./applicationconfig"
import { UserConfig } from "./userconfig"
import { CrossConfig } from "./crossconfig"
import { NodeConfig } from "./nodeconfig"
import { Config } from "./config"

export class ClientConfig extends Config {
	@JsonProperty("resolverUrl")
	private resolverUrl: string;
	@JsonProperty("application")
	private applicationConfig: ApplicationConfig;
	@JsonProperty("user")
	private userConfig: UserConfig ;
	@JsonProperty("node")
	private nodeConfig: NodeConfig ;
	@JsonProperty("cross")
	private crossConfig: CrossConfig ;

	public getResolverUrl(): string {
		return this.resolverUrl;
	}

	public getApplicationConfig(): ApplicationConfig {
		return this.applicationConfig;
	}

	public getUserConfig(): UserConfig {
		return this.userConfig;
	}

	public getNodeConfig(): NodeConfig {
		return this.nodeConfig;
	}

	public getCrossConfig(): CrossConfig {
		return this.crossConfig;
	}

	public static deserialize(content: string): ClientConfig {
		return super.parse(content, ClientConfig);
	}
}
