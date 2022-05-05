import {Component} from '@angular/core';
import ClientConfig from "../hivejs/config/clientconfig";
import {NodeVault} from "../hivejs/v2/node_vault";
import {
    Executable,
    FileDownloadExecutable,
    FileUploadExecutable,
    InsertOptions,
    VaultInfo
} from "@elastosfoundation/hive-js-sdk";
import {browserLogin} from "../hivejs/v2/browser_login";
import {BrowserVault} from "../hivejs/v2/browser_vault";

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

    private readonly config: ClientConfig;
    private readonly isBrowser: boolean;

    constructor() {
        this.message = 'Tab 1 Page';

        // This used to switch between mainnet and testnet.
        this.config = ClientConfig.DEV;

        // This used to run in node style or browser style which will work with essentials application.
        this.isBrowser = true;
    }

    private async getVault(): Promise<NodeVault> {
        if (!this.vault) {
            await browserLogin.initAndLogin();
            if (this.isBrowser)
                this.vault = new BrowserVault(this.config);
            else
                this.vault = await NodeVault.create(this.config);
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
}
