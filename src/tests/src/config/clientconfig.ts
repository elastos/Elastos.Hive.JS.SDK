import localConfig from "../res/local.json";
import devConfig from "../res/developing.json";
import prodConfig from "../res/production.json";

export class ClientConfig {
    public static LOCAL = localConfig;
    public static DEV = devConfig;
    public static PRODUCTION = prodConfig;

    private static CURRENT_CONFIG = ClientConfig.LOCAL;

    public static setConfiguration(config: any): void {
        ClientConfig.CURRENT_CONFIG = config;
    }

    public static get() {
        return ClientConfig.CURRENT_CONFIG;
    }
}