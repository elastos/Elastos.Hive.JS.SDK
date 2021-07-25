import { JsonProperty } from "@elastosfoundation/jackson-js";
import { Config } from "./config"

export class UserConfig extends Config {
	@JsonProperty("name")
	private name: string;
	@JsonProperty("mnemonic")
	private mnemonic: string;
	@JsonProperty("passPhrase")
	private passPhrase: string;
	@JsonProperty("storepass")
	private storepass: string;

	public getName(): string {
		return this.name;
	}

	public getMnemonic(): string {
		return this.mnemonic;
	}

	public getPassPhrase(): string {
		return this.passPhrase;
	}

	public getStorepass(): string {
		return this.storepass;
	}

	public static deserialize(content: string): UserConfig {
		return super.parse(content, UserConfig);
	}
}
