import {Component} from '@angular/core';
import ClientConfig from "../hivejs/config/clientconfig";
import {NodeVault} from "../hivejs/node_vault";
import {
    Executable,
    FileDownloadExecutable,
    FileUploadExecutable,
    InsertOptions,
    VaultInfo
} from "@elastosfoundation/hive-js-sdk";
import {browserLogin} from "../hivejs/browser_login";
import {BrowserVault} from "../hivejs/browser_vault";
import {PaymentContract} from "@elastosfoundation/hive-payment-js-sdk";

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    private static readonly COLLECTION_NAME: string = 'ionic_collection';
    private static readonly FILE_NAME: string = 'ionic_file.txt';
    private static readonly FILE_CONTENT: string = 'This is the file content: abcdefghijklmnopqrstuvwxyz';
    private static readonly SCRIPT_NAME: string = 'ionic_script';
    private static readonly EXECUTABLE_NAME: string = 'ionic_executable';

    public message: string;
    // user's vault.
    private vault: any;

    private readonly isBrowser: boolean;

    private paymentContract: PaymentContract;
    private isInitPayment = false;

    constructor() {
        this.message = 'Tab 1 Page';

        // This used to switch between mainnet and testnet.
        ClientConfig.setCurrent(ClientConfig.DEV);

        // This used to run in node style or browser style which will work with essentials application.
        this.isBrowser = true;

        this.paymentContract = new PaymentContract(true);
    }

    async initPaymentContract() {
        if (!this.isInitPayment) {
            await this.paymentContract.initialize();
            this.isInitPayment = true;
        }
    }

    /**
     * Here is the example which shows how to initialize hive js relating functions.
     * @private
     */
    private async getVault(): Promise<NodeVault> {
        if (!this.vault) {
            await browserLogin.initAndLogin();
            if (this.isBrowser)
                this.vault = new BrowserVault();
            else
                this.vault = await NodeVault.create();
        }
        return this.vault;
    }

    async updateMessage(action: () => Promise<void>) {
        this.message = 'Processing ...';
        let result = true;
        try {
            await action();
        } catch (e) {
            console.log(`>>>>>> TAB ACTION ERROR: ${e}`);
            result = false;
        }
        this.message = result ? 'Succeed' : 'Failed';
    }

    private async subscribe() {
        await this.updateMessage(async () => {
            const vault = await this.getVault();
            const subscription = await vault.createVaultSubscription();
            await subscription.subscribe();
        });
    }

    async vaultInfo() {
        await this.updateMessage(async () => {
            const vault = await this.getVault();
            const subscription = await vault.createVaultSubscription();
            const vaultInfo: VaultInfo = await subscription.checkSubscription();
            console.log(`vault info: ${vaultInfo}`);
        });
    }

    async unsubscribe() {
        await this.updateMessage(async () => {
            const vault = await this.getVault();
            const subscription = await vault.createVaultSubscription();
            await subscription.unsubscribe();
        });
    }

    async insertDocument() {
        await this.updateMessage(async () => {
            const vault = await this.getVault();
            const databaseService = await (await vault.createVault()).getDatabaseService();
            try {
                await databaseService.createCollection(Tab1Page.COLLECTION_NAME);
            } catch (e) {}
            const doc = {"author": "john doe1", "title": "Eve for Dummies1"};
            await databaseService.insertOne(
                Tab1Page.COLLECTION_NAME, doc,
                new InsertOptions(false, false)
            );
        });
    }

    async deleteDocument() {
        await this.updateMessage(async () => {
            const vault = await this.getVault();
            const databaseService = await (await vault.createVault()).getDatabaseService();
            const filter = { "author": "john doe1" };
            await databaseService.deleteMany(Tab1Page.COLLECTION_NAME, filter);
            try {
                await databaseService.deleteCollection(Tab1Page.COLLECTION_NAME);
            } catch (e) {}
        });
    }

    async uploadFile() {
        await this.updateMessage(async () => {
            const vault = await this.getVault();
            const filesService = await (await vault.createVault()).getFilesService();
            const buffer = Buffer.from(Tab1Page.FILE_CONTENT, 'utf8');
            await filesService.upload(Tab1Page.FILE_NAME, buffer);
        });
    }

    async downloadFile() {
        await this.updateMessage(async () => {
            const vault = await this.getVault();
            const filesService = await (await vault.createVault()).getFilesService();
            const content = await filesService.download(Tab1Page.FILE_NAME);
            console.log(`Get the content of the file '${Tab1Page.FILE_NAME}': ${content.toString()}`);
            await filesService.delete(Tab1Page.FILE_NAME);
        });
    }

    async scriptingUpload() {
        await this.updateMessage(async () => {
            const vault = await this.getVault();
            const scriptingService = await (await vault.createVault()).getScriptingService();
            // register
            await scriptingService.registerScript(
                Tab1Page.SCRIPT_NAME,
                new FileUploadExecutable(Tab1Page.EXECUTABLE_NAME).setOutput(true),
                undefined,
                false,
                false);
            // call
            const result = await scriptingService.callScript<any>(
                Tab1Page.SCRIPT_NAME,
                Executable.createRunFileParams(Tab1Page.FILE_NAME),
                vault.getTargetUserDid(),
                vault.getTargetAppDid());
            // upload
            const buffer = Buffer.from(Tab1Page.FILE_CONTENT, 'utf8');
            await scriptingService.uploadFile(result[Tab1Page.EXECUTABLE_NAME].transaction_id, buffer);
            // clean
            await scriptingService.unregisterScript(Tab1Page.SCRIPT_NAME);
        });
    }

    async scriptingDownload() {
        await this.updateMessage(async () => {
            const node = await this.getVault();
            const vault = await node.createVault();
            const filesService = await vault.getFilesService();
            const scriptingService = await vault.getScriptingService();
            // register
            await scriptingService.registerScript(
                Tab1Page.SCRIPT_NAME,
                new FileDownloadExecutable(Tab1Page.SCRIPT_NAME).setOutput(true),
                undefined, false, false);
            // call
            const result = await scriptingService.callScript(
                Tab1Page.SCRIPT_NAME,
                Executable.createRunFileParams(Tab1Page.FILE_NAME),
                node.getTargetUserDid(),
                node.getTargetAppDid());
            // upload
            const content = await scriptingService.downloadFile(result[Tab1Page.EXECUTABLE_NAME].transaction_id);
            console.log(`Get the content of the file '${Tab1Page.FILE_NAME}': ${content.toString()}`);
            // clean
            await filesService.delete(Tab1Page.FILE_NAME);
            await scriptingService.unregisterScript(Tab1Page.SCRIPT_NAME);
        });
    }

    async payOrder() {
        await this.initPaymentContract();
        await this.updateMessage(async () => {
            const nodeWalletAddress = '0x60ECEFaFA8618F4eAC7a04ba58F67f56e12750d3'; // contract owner wallet
            const proof = 'eyJhbGciOiAiRVMyNTYiLCAidHlwZSI6ICJKV1QiLCAidmVyc2lvbiI6ICIxLjAiLCAia2lkIjogImRpZDplbGFzdG9zOmlwVUdCUHVBZ0V4NkxlOTlmNFR5RGZOWnRYVlQyTktYUFIjcHJpbWFyeSJ9.eyJpc3MiOiJkaWQ6ZWxhc3RvczppcFVHQlB1QWdFeDZMZTk5ZjRUeURmTlp0WFZUMk5LWFBSIiwic3ViIjoiSGl2ZSBQYXltZW50IiwiYXVkIjoiZGlkOmVsYXN0b3M6aXBCYUJyNkhRNmg5MlQxZmg1ZkZRUzE0eGhUY3l0M0F6cSIsImlhdCI6MTY1MzU0MzcxMSwiZXhwIjozMzA3NjYzNDIyLCJuYmYiOjE2NTM1NDM3MTEsIm9yZGVyIjp7ImludGVyaW1fb3JkZXJpZCI6IjYyOGYxMzFmM2E1NDRjOWFkODExNjkwOCIsInN1YnNjcmlwdGlvbiI6InZhdWx0IiwicHJpY2luZ19wbGFuIjoiUm9va2llIiwicGF5bWVudF9hbW91bnQiOjAuMDEsImNyZWF0ZV90aW1lIjoxNjUzNTE0OTExLCJleHBpcmF0aW9uX3RpbWUiOjE2NTQxMTk3MTEsInJlY2VpdmluZ19hZGRyZXNzIjoiMHg2MEVDRUZhRkE4NjE4RjRlQUM3YTA0YmE1OEY2N2Y1NmUxMjc1MGQzIn19.uhp2qJ1CN5jfIw3ot_dz6hXJaI66dPUP2d0BGw-ZCGLirn4rwe2VMkP6xEjTKMwEvPxW-7JleaYl9NGT3_u70Q';
            const orderId = await this.paymentContract.payOrder("0.01", nodeWalletAddress, proof);
            console.log(`pay order successfully: ${orderId}.`);
        });
    }

    async getOrders() {
        await this.initPaymentContract();
        await this.updateMessage(async () => {
            const orders = await this.paymentContract.getOrders();
            console.log(`getOrders() successfully: ${orders}`);
        });
    }

    async getOrderByIndex() {
        await this.initPaymentContract();
        await this.updateMessage(async () => {
            const order = await this.paymentContract.getOrderByIndex(0);
            console.log(`getOrderByIndex() successfully: ${order}`);
        });
    }

    async getOrderCount() {
        await this.initPaymentContract();
        await this.updateMessage(async () => {
            const count = await this.paymentContract.getOrderCount();
            console.log(`getOrderCount() successfully: ${count}`);
        });
    }

    async getOrder() {
        await this.initPaymentContract();
        await this.updateMessage(async () => {
            const orderId = 0;
            const order = await this.paymentContract.getOrder(orderId);
            console.log(`getOrder() successfully: ${order}`);
        });
    }
}
