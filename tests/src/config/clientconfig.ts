import devConfig from "../res/developing.json";
import customConfig from "../res/custom.json";

export class ClientConfig {
    public static DEV = devConfig;
    public static CUSTOM = customConfig;

    private static CURRENT_CONFIG = ClientConfig.DEV;

    public static setConfiguration(config: any): void {
        ClientConfig.CURRENT_CONFIG = config;
    }

    public static get(): any {
        return ClientConfig.CURRENT_CONFIG;
    }
}
