export class Config {
    static APPLICATION_DID = 'did:elastos:iqtWRVjz7gsYhyuQEb1hYNNmWQt1Z9geXg';
    static TRINITY_API = 'trinity-tech.cn';
    static ELASTOS_API = 'elastos.io';

    static ELASTOS_BRIDGE = 'https://walletconnect.elastos.net/v2';
    static TRINITY_BRIDGE = 'https://walletconnect.trinity-tech.cn/v2';

    static BRIDGE = Config.ELASTOS_BRIDGE;

    private static BASE_API = Config.ELASTOS_API;

    static EID_RPC = 'https://api.' + Config.BASE_API + '/eid';

    /**后台服务*/
    static SERVER: string = 'https://www.trinity-tech.io/feeds/api/v3';

    /** MainNet contract */
    static STICKER_ADDRESS: string = '0x020c7303664bc88ae92cE3D380BF361E03B78B81';
    static PASAR_ADDRESS: string = '0x02E8AD0687D583e2F6A7e5b82144025f30e26aA0';
    static DIAMOND_ADDRESS: string = '0x2C8010Ae4121212F836032973919E8AeC9AEaEE5';
    static GallERIA_ADDRESS: string = '0xE91F413953A82E15B92Ffb93818d8a7b87C3939B';
    static CONTRACT_URI = 'https://api.' + Config.BASE_API + '/eth';

    static CONTRACT_CHAINID: number = 20;
    static CONTRACT_RPC = {
        20: Config.CONTRACT_URI
    }
    /** MainNet IPFS */
    static IPFS_SERVER: string = 'https://ipfs.trinity-feeds.app/';
    /** MainNet ASSIST */
    static ASSIST_SERVER: string = 'https://assist.trinity-feeds.app/';
    /** TestNet contract */
    static STICKER_TEST_ADDRESS: string = '0xed1978c53731997f4DAfBA47C9b07957Ef6F3961';
    static PASAR_TEST_ADDRESS: string = '0x2652d10A5e525959F7120b56f2D7a9cD0f6ee087';
    static HIVE_NODE_ADDRESS: string = '0x0E7EE480dE19E5BB766bD790774B315b02bfD4e1';
    static GallERIA_TEST_ADDRESS: string = '0x8b3c7Fc42d0501e0367d29426421D950f45F5041';
    static DIAMOND_TEST_ADDRESS: string = '';

    static CONTRACT_TEST_URI = 'https://api-testnet.' + Config.BASE_API + '/eth';
    static CONTRACT_TEST_CHAINID: number = 21;
    static CONTRACT_TEST_RPC = {
        21: Config.CONTRACT_TEST_URI
    }
    /** TestNet IPFS */
    static IPFS_TEST_SERVER: string = 'https://ipfs-test.trinity-feeds.app/';

    static changeApi(api: string) {
        if (api == 'elastos.io') {
            Config.BASE_API = Config.ELASTOS_API;
            Config.BRIDGE = Config.ELASTOS_BRIDGE;
        } else {
            Config.BASE_API = Config.TRINITY_API;
            Config.BRIDGE = Config.TRINITY_BRIDGE;
        }


        Config.reset();
    }

    static reset() {
        Config.EID_RPC = 'https://api.' + Config.BASE_API + '/eid';
        Config.CONTRACT_URI = 'https://api.' + Config.BASE_API + '/eth';
        Config.CONTRACT_RPC = {
            20: Config.CONTRACT_URI
        }

        Config.CONTRACT_TEST_URI = 'https://api-testnet.' + Config.BASE_API + '/eth';
        Config.CONTRACT_TEST_RPC = {
            21: Config.CONTRACT_TEST_URI
        }
    }

    static defaultIPFSApi(): string {
        const availableIpfsNetworkTemplates: string[] = [
            "https://ipfs0.trinity-feeds.app/",
            "https://ipfs1.trinity-feeds.app/",
            "https://ipfs2.trinity-feeds.app/",
        ];
        return availableIpfsNetworkTemplates[Math.floor(Math.random() * availableIpfsNetworkTemplates.length)];
    }

    static defaultAssistApi(): string {
        const availableAssistNetworkTemplates: string[] = [
            "https://assist0.trinity-feeds.app/",
            "https://assist1.trinity-feeds.app/",
            "https://assist2.trinity-feeds.app/",
        ];
        return availableAssistNetworkTemplates[Math.floor(Math.random() * availableAssistNetworkTemplates.length)];
    }

    static WAIT_TIME_CANCEL_ORDER = 2 * 60 * 1000;
    static WAIT_TIME_CHANGE_PRICE = 2 * 60 * 1000;
    static WAIT_TIME_BUY_ORDER = 2 * 60 * 1000;
    static WAIT_TIME_SELL_ORDER = 2 * 60 * 1000;
    static WAIT_TIME_BURN_NFTS = 2 * 60 * 1000;

    static WAIT_TIME_MINT = 3 * 60 * 1000;


    static CHECK_STATUS_INTERVAL_TIME = 5000;

    /** whitelist testNet */
    static WHITELIST_TEST_SERVER: string = 'https://assist.trinity-feeds.app/';

    static PASAR_ASSIST_TESTNET_SERVER: string = 'https://test.trinity-feeds.app/pasar/api/v1/';
    static PASAR_ASSIST_MAINNET_SERVER: string = 'https://assist.trinity-feeds.app/pasar/api/v1/';


    static GALLERIA_ASSIST_TESTNET_SERVER: string = 'https://test.trinity-feeds.app/galleria/api/v1/';
    static GALLERIA_ASSIST_MAINNET_SERVER: string = 'https://assist.trinity-feeds.app/galleria/api/v1/';

    static STICKER_ASSIST_TESTNET_SERVER: string = 'https://test.trinity-feeds.app/sticker/api/v1/';
    static STICKER_ASSIST_MAINNET_SERVER: string = 'https://assist.trinity-feeds.app/sticker/api/v1/';


    static BASE_PASAR_ASSIST_TESTNET_SERVER: string = 'https://test.trinity-feeds.app/';
}
