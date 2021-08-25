export class UserConfig {
	private name: string;
	private mnemonic: string;
	private passPhrase: string;
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

	public static deserialize(json: string): UserConfig {
		let jsonObj = JSON.parse(json);
		let newConfig = new UserConfig();

		newConfig.name = jsonObj['name'];
		newConfig.mnemonic = jsonObj['mnemonic'];
		newConfig.passPhrase = jsonObj['passPhrase'];
		newConfig.storepass = jsonObj['storepass'];

		return newConfig;
	}
}
