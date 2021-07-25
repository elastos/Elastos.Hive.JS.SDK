import { JsonProperty } from "@elastosfoundation/jackson-js";
import { ApplicationConfig } from "./applicationconfig"
import { UserConfig } from "./userconfig"
import { Config } from "./config"

export class CrossConfig extends Config {
	@JsonProperty("application")
	private applicationConfig: ApplicationConfig ;
	@JsonProperty("user")
	private userConfig: UserConfig ;
	@JsonProperty("crossDid")
	private crossDid: string ;

	public getApplicationConfig(): ApplicationConfig {
		return this.applicationConfig;
	}

	public getUserConfig(): UserConfig {
		return this.userConfig;
	}

	public getCrossDid(): string {
		return this.crossDid;
	}

	public static deserialize(content: string): CrossConfig {
		return super.parse(content, CrossConfig);
	}
}
