export class NodeConfig {
	private provider: string;
	// the service instance did of backup node.
	private targetDid: string;
	// the host of backup node.
	private targetHost: string
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

	public static deserialize(json: string): NodeConfig {
		let jsonObj = JSON.parse(json);
		let newConfig = new NodeConfig();

		newConfig.provider = jsonObj['provider'];
		newConfig.targetDid = jsonObj['targetDid'];
		newConfig.targetHost = jsonObj['targetHost'];
		newConfig.storePath = jsonObj['storePath'];

		return newConfig;
	}
}
