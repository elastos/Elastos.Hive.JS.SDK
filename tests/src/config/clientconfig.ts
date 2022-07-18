import testnet from "../res/testnet.json";
import mainnet from "../res/mainnet.json";

export class ClientConfig {
    public static TESTNET = testnet;
    public static MAINNET = mainnet;

    private static CURRENT_CONFIG = ClientConfig.TESTNET;

    public static setConfiguration(config: any): void {
        ClientConfig.CURRENT_CONFIG = config;
    }

    public static get(): any {
        return ClientConfig.CURRENT_CONFIG;
    }
}
