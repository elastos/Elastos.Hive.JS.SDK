export class ApplicationConfig {
	
	private name: string;
	private mnemonic: string;
	private passPhrase: string;
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

	public static deserialize(json: string): ApplicationConfig {
		let jsonObj = JSON.parse(json);
		let newConfig = new ApplicationConfig();
		newConfig.name = jsonObj['name'];
		newConfig.mnemonic = jsonObj['mnemonic'];
		newConfig.passPhrase = jsonObj['passPhrase'];
		newConfig.storepass = jsonObj['storepass'];

		return newConfig;
	}
}
