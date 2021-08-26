import { ApplicationConfig } from "./applicationconfig"
import { UserConfig } from "./userconfig"

export class CrossConfig {
	private application: ApplicationConfig;
	private user: UserConfig;
	private crossDid: string;

	public getApplicationConfig(): ApplicationConfig {
		return this.application;
	}

	public getUserConfig(): UserConfig {
		return this.user;
	}

	public getCrossDid(): string {
		return this.crossDid;
	}

	public static deserialize(json: any): CrossConfig {
		let jsonObj = (typeof json === "string" ? JSON.parse(json as string) : json);
		let newConfig = new CrossConfig();

		newConfig.application = ApplicationConfig.deserialize(jsonObj['application']);
		newConfig.user = UserConfig.deserialize(jsonObj['user']);
		newConfig.crossDid = jsonObj['crossDid'];

		return newConfig;
	}
}
