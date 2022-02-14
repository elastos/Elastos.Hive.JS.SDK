// import localConfig from "./local.json";
// import devConfig from "developing.json";
// import prodConfig from "production.json";
// import customConfig from "custom.json";

export default class ClientConfig {
    public static LOCAL = require('./local.json');
    public static DEV = require('./developing.json');
    public static PRODUCTION = require('./production.json');
    public static CUSTOM = require('./custom.json');

    private static CURRENT_CONFIG = ClientConfig.LOCAL;

    public static setConfiguration(config: any): void {
        ClientConfig.CURRENT_CONFIG = config;
    }

    public static get(): any {
        return ClientConfig.CURRENT_CONFIG;
    }
}