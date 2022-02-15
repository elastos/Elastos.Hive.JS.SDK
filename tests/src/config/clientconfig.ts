import localConfig from "../res/local.json";
import devConfig from "../res/developing.json";
import prodConfig from "../res/production.json";
import customConfig from "../res/custom.json";
import testConfig from "../res/testnet.json";

export class ClientConfig {
    public static LOCAL = localConfig;
    public static DEV = devConfig;
    public static PRODUCTION = prodConfig;
    public static CUSTOM = customConfig;
    public static TEST = testConfig;

    private static CURRENT_CONFIG = ClientConfig.LOCAL;

    public static setConfiguration(config: any): void {
        ClientConfig.CURRENT_CONFIG = config;
    }

    public static get(): any {
        return ClientConfig.CURRENT_CONFIG;
    }
}