import { ApplicationConfig } from "./applicationconfig"
import { UserConfig } from "./userconfig"
import { CrossConfig } from "./crossconfig"
import { NodeConfig } from "./nodeconfig"

export class ClientConfig {
	private resolverUrl: string;
	private application: ApplicationConfig;
	private user: UserConfig ;
	private node: NodeConfig ;
	private cross: CrossConfig ;

	public getResolverUrl(): string {
		return this.resolverUrl;
	}

	public getApplicationConfig(): ApplicationConfig {
		return this.application;
	}

	public getUserConfig(): UserConfig {
		return this.user;
	}

	public getNodeConfig(): NodeConfig {
		return this.node;
	}

	public getCrossConfig(): CrossConfig {
		return this.cross;
	}

	public static deserialize(json: string): ClientConfig {
		let jsonObj = JSON.parse(json);
		let newConfig = new ClientConfig();
		newConfig.resolverUrl = jsonObj['resolverUrl'];
		newConfig.application = ApplicationConfig.deserialize(jsonObj['application']);
		newConfig.user = UserConfig.deserialize(jsonObj['user']);
		newConfig.node = NodeConfig.deserialize(jsonObj['node']);
		newConfig.cross = CrossConfig.deserialize(jsonObj['cross']);

		return newConfig;
	}
}
