import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {Config} from "./config";
import {Logger, LogLevel} from "./logger";

const TAG = 'WalletConnector';


/**
 * Wallet Connector
 *
 * Usage examples:
 *
 *      const connector = new WalletConnector();
 *      await connector.initialize();
 *
 *      // Normal access with web3: Get Accounts
 *      const accounts = await connector.getWeb3().eth.getAccounts();
 *
 */
export class WalletConnector {
    // for WalletConnectProvider
    private rpc: { [chainId: number]: string } = Config.CONTRACT_RPC;
    private bridge: string = Config.BRIDGE;

    // for Contract
    private paymentAddr: string = Config.HIVE_NODE_ADDRESS;
    private paymentAbi = require('./order_abi.json');

    private provider: WalletConnectProvider;
    private web3: Web3;
    private contract;

    private accountAddress: string;

    private readonly testMode = true; // to switch between mainnet and testnet

    constructor() {
        Logger.setLogLevel(LogLevel.DEBUG);
        this.setTestMode(this.testMode);
        console.log('this.rpc', this.rpc);
    }

    /**
     * for init.
     */
    async initialize() {
        await this.initProvider();
        this.web3 = new Web3(this.provider as any);
        this.accountAddress = (await this.web3.eth.getAccounts())[0];
        this.contract = new this.web3.eth.Contract(this.paymentAbi, this.paymentAddr);
        console.log('connector initialized.')
    }

    getWeb3(): Web3 {
        return this.web3;
    }

    getContract() {
        return this.contract;
    }

    getAccountAddress() {
        return this.accountAddress;
    }

    getReceiverAddress() {
        return this.paymentAddr;
    }

    private async initProvider() {
        this.provider = new WalletConnectProvider({
            rpc: this.rpc,
            bridge: this.bridge,
            qrcodeModalOptions: {
                mobileLinks: ['essential', 'metamask']
            }
        });

        // Subscribe to accounts change
        this.provider.on('accountsChanged', (accounts: string[]) => {
            Logger.log(TAG, 'accountsChanged', accounts.length > 0 ? accounts[0] : null);
            if (accounts.length > 0) {
                this.accountAddress = accounts[0];
            }
        });

        // Subscribe to chainId change
        this.provider.on('chainChanged', (chainId: number) => {
            Logger.log(TAG, 'chainChanged', chainId);
        });

        // wallet error
        this.provider.on('error', (errors) => {
            Logger.error(TAG, "wallet connect error", errors);
        });

        // Subscribe to session disconnection
        this.provider.on('disconnect', async (code, reason) => {
            Logger.log(TAG, "disconnect", code, reason);
            await this.closeProvider();
        });

        //  Enable session (triggers QR Code modal)
        await this.provider.enable();
    }

    private async closeProvider() {
        try {
            await this.provider.disconnect();
        } catch (error) {
            Logger.error(TAG, "failed to disconnect and close", error);
        }
    }

    private setTestMode(mode: boolean) {
        if (mode) {
            this.rpc = Config.CONTRACT_TEST_RPC;
        } else {
            this.rpc = Config.CONTRACT_RPC;
        }
    }
}
