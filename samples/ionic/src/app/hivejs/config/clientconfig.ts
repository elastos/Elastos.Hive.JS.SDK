export default class ClientConfig {
    public static DEV = require('./developing.json');
    public static CUSTOM = require('./custom.json');

    private static CURRENT_CONFIG = ClientConfig.DEV;

    public static setCurrent(config: any): void {
        ClientConfig.CURRENT_CONFIG = config;
    }

    public static getCurrent(): any {
        return ClientConfig.CURRENT_CONFIG;
    }

    public static isTestNet(): boolean {
        return ClientConfig.CURRENT_CONFIG == ClientConfig.DEV;
    }
}
