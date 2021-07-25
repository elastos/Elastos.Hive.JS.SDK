import { JsonProperty } from "@elastosfoundation/jackson-js";
import { Config } from "./config"

export class ApplicationConfig extends Config {
	
	@JsonProperty({ value: "name" })
	private name: string;
	@JsonProperty({ value: "mnemonic" })
	private mnemonic: string;
	@JsonProperty({ value: "passPhrase" })
	private passPhrase: string;
	@JsonProperty({ value: "storepass" })
	private storepass: string;

	public ApplicationConfig (name: string, mnemonic: string, passPhrase: string, storepass: string) {
		this.name = name;
		this.mnemonic = mnemonic;
		this.passPhrase = passPhrase;
		this.storepass = storepass;
	}

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

	public static deserialize(content : string): ApplicationConfig {
		return super.parse(content, ApplicationConfig);
	}
}
