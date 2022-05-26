import {WalletConnector} from "./wallet_connector";
import Web3 from "web3";
import BN from "bn.js";


type TransactionData = {
    from: string;
    gasPrice: string;
    gas: number;
    value: any;
}


/**
 * Only for hive node payment service.
 *
 *      const paymentContract = new PaymentContract();
 *      const orders = await paymentContract.getOrders();
 */
export class PaymentContract {
    private connector: WalletConnector;

    constructor() {
        this.connector = new WalletConnector();
    }

    async initialize() {
        await this.connector.initialize();

        this.connector.getContract().events.OrderPay(null,
            function(error, event){ console.log('events.OrderPay', event); })
            .on("connected", function(subscriptionId){
                // events.OrderPay.connected 0xbfd0d15d9085f0c5f4008f6d6b2d460d, sender account.
                console.log('events.OrderPay.connected', subscriptionId)
            })
            .on('data', function(event){
                // same results as the optional callback above
                console.log('events.OrderPay.data', event)
            })
            .on('changed', function(event){
                // remove event from local database
                console.log('events.OrderPay.changed', event)
            })
            .on('error', function(error, receipt) {
                console.log('events.OrderPay.error', error, receipt)
            });
    }

    /**
     * Pay order on the smart contract.
     *
     * @param amount
     * @param to
     * @param memo
     * @return contract order id
     */
    async payOrder(amount: string, to: string, memo: string) {
        const orderData = this.connector.getContract().methods.payOrder(to, memo).encodeABI();
        let transactionParams = await this.createTxParams(orderData, amount, to);

        console.log('after createTxParams', orderData, transactionParams)

        // // Can not work with call() because of no transaction sending.
        // return await this.connector.getContract().methods.payOrder(to, memo).call(transactionParams);
        // contract.methods.payOrder(to, memo).call(transactionParams, function (error, result) {
        //     console.log(`payOrder error: ${error}, ${result}`);
        // });

        // OK with send()
        this.connector.getContract().methods
            .payOrder(to, memo)
            .send(transactionParams)
            .on('transactionHash', hash => {
                // transaction id
                console.log('methods.payOrder.transactionHash', hash)
            })
            .on('receipt', receipt => {
                // contains sender wallet address.
                console.log('methods.payOrder.receipt', receipt)
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                // confirmed by other accounts ???
                console.log('methods.payOrder.confirmation', confirmationNumber, receipt)
            })
            .on('error', (error, receipt) => {
                console.log('methods.payOrder.error', error, receipt)
            });
        return 0;
    }

    private async createTxParams(data: string, price: string, to: string): Promise<TransactionData> {
        const accountAddress = this.connector.getAccountAddress(); // sender wallet address
        const receiverAddress = this.connector.getReceiverAddress(); // contract address
        console.log(`from: ${accountAddress}, to: ${to}, through: ${receiverAddress}`);

        const price_token = new BN(Web3.utils.toWei(price, 'ether'));
        console.log(`price_token by 'ether', ${price_token}`);

        const txData = {
            from: accountAddress,
            to: receiverAddress,
            data: data,
            value: price_token,
        };

        try {
            const txGas = await this.connector.getWeb3().eth.estimateGas(txData);
            console.log(`after this.web3.eth.estimateGas: ${txData}`);
            const gasPrice = await this.connector.getWeb3().eth.getGasPrice();
            return  {
                from: accountAddress,
                gasPrice: gasPrice,
                gas: Math.round(txGas * 3),
                value: price_token,
            };
        } catch (error) {
            throw new Error(`failed to get gas price: ${error}`);
        }
    }

    /**
     * Pay order on the smart contract.
     */
    async getOrders() {
        const accountAddress = await this.connector.getAccountAddress();
        return await this.connector.getContract().methods.getOrders(accountAddress).call();
    }

    async getOrder(orderId) {
        return await this.connector.getContract().methods.getOrder(orderId).call();
    }
}