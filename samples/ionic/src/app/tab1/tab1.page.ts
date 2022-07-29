import {Component} from '@angular/core';
import ClientConfig from "../hivejs/config/clientconfig";
import {NodeVault} from "../hivejs/node_vault";
import {
    AlreadyExistsException, BackupResultResult,
    Executable,
    FileDownloadExecutable,
    FileUploadExecutable,
    InsertOptions, NotFoundException, Order, Receipt,
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

        // TODO: This used to switch between mainnet(CUSTOM) and testnet(DEV).
        //       Please also swith the AppDID.APP_DID
        ClientConfig.setCurrent(ClientConfig.DEV);

        // TODO: This used to run in node style or browser style which will work with essentials application.
        this.isBrowser = true;

        this.paymentContract = new PaymentContract(ClientConfig.isTestNet());
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
            if (this.isBrowser) {
                await browserLogin.initAndLogin();
                this.vault = new BrowserVault();
            } else
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
            this.log(`TAB ACTION ERROR: ${e}`);
            result = false;
        }
        this.message = result ? 'Succeed' : 'Failed';
    }

    private async subscribe() {
        await this.updateMessage(async () => {
            const vault = await this.getVault();
            const subscription = await vault.createVaultSubscription();
            try {
                await subscription.subscribe();
                this.log('subscribe done');
            } catch (e) {
                if (e instanceof AlreadyExistsException) {
                    this.log('already exists')
                } else {
                    throw e;
                }
            }
        });
    }

    async vaultInfo() {
        await this.updateMessage(async () => {
            const vault = await this.getVault();
            const subscription = await vault.createVaultSubscription();
            const vaultInfo: VaultInfo = await subscription.checkSubscription();
            this.log(`vault info: ${JSON.stringify(vaultInfo)}`);
        });
    }

    async unsubscribe() {
        await this.updateMessage(async () => {
            const vault = await this.getVault();
            const subscription = await vault.createVaultSubscription();
            try {
                await subscription.unsubscribe();
                this.log('unsubscribe done');
            } catch (e) {
                if (e instanceof NotFoundException) {
                    this.log('the vault does not exist, skip');
                } else {
                    throw e;
                }
            }
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

            // const buffer = Buffer.from(Tab1Page.FILE_CONTENT, 'utf8');
            // big file content
            const bufferSize = 100000000;
            let buffer = Buffer.alloc(bufferSize, Tab1Page.FILE_CONTENT, 'utf8');
            for (let i = 0; i < bufferSize; i++) {
                buffer.writeUInt8(48, i);
            }

            await filesService.upload(Tab1Page.FILE_NAME, buffer, process => {
                this.log('uploading process: ' + process);
            }, false, null);
            this.log('uploading file done !');
        });
    }

    async downloadFile() {
        await this.updateMessage(async () => {
            const vault = await this.getVault();
            const filesService = await (await vault.createVault()).getFilesService();
            const content = await filesService.download(Tab1Page.FILE_NAME, process => {
                this.log('downloading process: ' + process);
            });
            this.log(`Get the content of the file '${Tab1Page.FILE_NAME}': ${content.toString()}`);
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
            // const buffer = Buffer.from(Tab1Page.FILE_CONTENT, 'utf8');

            // big file content
            const bufferSize = 100000000;
            let buffer = Buffer.alloc(bufferSize, Tab1Page.FILE_CONTENT, 'utf8');
            for (let i = 0; i < bufferSize; i++) {
                buffer.writeUInt8(48, i);
            }

            await scriptingService.uploadFile(result[Tab1Page.EXECUTABLE_NAME].transaction_id, buffer, process => {
                this.log('uploading process: ' + process);
            });
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
                new FileDownloadExecutable(Tab1Page.EXECUTABLE_NAME).setOutput(true),
                undefined, false, false);
            // call
            const result = await scriptingService.callScript(
                Tab1Page.SCRIPT_NAME,
                Executable.createRunFileParams(Tab1Page.FILE_NAME),
                node.getTargetUserDid(),
                node.getTargetAppDid());
            // upload
            const content = await scriptingService.downloadFile(result[Tab1Page.EXECUTABLE_NAME].transaction_id, process => {
                this.log('downloading process: ' + process);
            });
            this.log(`Get the content of the file '${Tab1Page.FILE_NAME}': ${content.toString()}`);
            // clean
            await filesService.delete(Tab1Page.FILE_NAME);
            await scriptingService.unregisterScript(Tab1Page.SCRIPT_NAME);
        });
    }

    private sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    /**
     * This example shows how to migrate the vault to another node,
     * here two nodes are same.
     *
     * The process of migration:
     *
     *      1. create a vault (migration source) and input some data and files on node A.
     *      2. subscribe a backup service on node B.
     *      3. deactivate the vault, then execute backup on node A to node B.
     *      4. make sure no vault on node B and promote the backup data to a new vault.
     *      5. update the user DID info. on chain with node B url.
     *      6. unsubscribe the vault on node A.
     *      7. all done. the vault can be used on node B.
     *
     */
    async migration() {
        await this.updateMessage(async () => {
            const baseVault = await this.getVault();
            const vault = await baseVault.createVault();
            const subscription = await baseVault.createVaultSubscription();
            const subscriptionBackup = await baseVault.createBackupSubscription();

            // try to remove the exist vault and backup service, clean start.
            try {
                await subscription.unsubscribe();
            } catch (e) {
                if (!(e instanceof NotFoundException)) {
                    throw e;
                }
            }
            try {
                await subscriptionBackup.unsubscribe();
            } catch (e) {
                if (!(e instanceof NotFoundException)) {
                    throw e;
                }
            }

            // 1. create a new vault as the source of the migration operation.
            await subscription.subscribe();
            this.log('a clean vault created.')

            // insert document
            const databaseService = await vault.getDatabaseService();
            try {
                await databaseService.createCollection(Tab1Page.COLLECTION_NAME);
            } catch (e) {}
            const doc = {"author": "john doe1", "title": "Eve for Dummies1"};
            await databaseService.insertOne(
                Tab1Page.COLLECTION_NAME, doc,
                new InsertOptions(false, false)
            );
            this.log('a new document is been inserted.')

            // upload file
            const filesService = await vault.getFilesService();
            const buffer = Buffer.from(Tab1Page.FILE_CONTENT, 'utf8');
            await filesService.upload(Tab1Page.FILE_NAME, buffer);
            this.log('a new file is been uploaded.')

            // 2. subscribe the backup service
            await subscriptionBackup.subscribe();
            this.log('subscribe a backup service.')

            // 3. deactivate the vault to a void data changes in the backup process.
            await subscription.deactivate();
            this.log('deactivate the source vault.')

            // 4. backup the vault data.
            const backupService = await baseVault.getBackupService(vault);
            await backupService.startBackup();

            // wait backup end.
            let count = 0;
            while (count < 30) {
                const info = await backupService.checkResult();
                if (info.getResult() == BackupResultResult.RESULT_PROCESS) {
                    // go on.
                } else if (info.getResult() == BackupResultResult.RESULT_SUCCESS) {
                    break;
                } else {
                    throw new Error(`failed to backup: ${info.getMessage()}`)
                }
                count++;
                this.log('backup in process, try to wait.');
                await this.sleep(1000);
            }
            this.log('backup done.');

            // 5. promotion, same vault, so need remove vault first.
            await subscription.unsubscribe();

            // promote
            const backup = await baseVault.createBackup();
            await backup.getPromotionService().promote();
            this.log('promotion over from backup data to a new vault.');

            this.log('TODO: public user DID with backup node url here');
            this.log('remove the vault on vault node here, same node, skip');

            // check the data of the new vault.
            const obj = await databaseService.findOne(Tab1Page.COLLECTION_NAME, doc);
            this.log(`find doc: ${JSON.stringify(obj)}`);

            // check the file
            const content = await filesService.download(Tab1Page.FILE_NAME);
            this.log(`Get the content of the file '${Tab1Page.FILE_NAME}': ${content.toString()}`);

            this.log('migration is done !!!')
        });
    }

    async payOrder() {
        await this.initPaymentContract();
        await this.updateMessage(async () => {
            const nodeWalletAddress = '0xB98c051c98D8fB5436fC62fc8a7FdA487a482776'; // any wallet address, ee
            const proof = 'eyJhbGciOiAiRVMyNTYiLCAidHlwZSI6ICJKV1QiLCAidmVyc2lvbiI6ICIxLjAiLCAia2lkIjogImRpZDplbGFzdG9zOmlqZWJKQnNTWnhKaktrU1pEODZrWlhYTTN1SmlVYlpjamgjcHJpbWFyeSJ9.eyJpc3MiOiJkaWQ6ZWxhc3RvczppamViSkJzU1p4SmpLa1NaRDg2a1pYWE0zdUppVWJaY2poIiwic3ViIjoiSGl2ZSBQYXltZW50IiwiYXVkIjoiZGlkOmVsYXN0b3M6aXBCYUJyNkhRNmg5MlQxZmg1ZkZRUzE0eGhUY3l0M0F6cSIsImlhdCI6MTY1NDQ3OTIyOCwiZXhwIjozMzA5NTYzMjU2LCJuYmYiOjE2NTQ0NzkyMjgsIm9yZGVyIjp7ImludGVyaW1fb3JkZXJpZCI6IjYyOWQ1OTdjN2MyZWY0M2FlZjYzYmM1OSIsInN1YnNjcmlwdGlvbiI6ImJhY2t1cCIsInByaWNpbmdfcGxhbiI6IlJvb2tpZSIsInBheW1lbnRfYW1vdW50IjoxLjUsImNyZWF0ZV90aW1lIjoxNjU0NDc5MjI4LCJleHBpcmF0aW9uX3RpbWUiOjE2NTUwODQwMjgsInJlY2VpdmluZ19hZGRyZXNzIjoiMHg2MEVDRUZhRkE4NjE4RjRlQUM3YTA0YmE1OEY2N2Y1NmUxMjc1MGQzIn19.w2k7nbGXPvDFlqhNG0HhPVzvliWDhx1mb68lraHFlD2KqhVtonj5qwJ7XRK97AvpgqbziyQG5zYlzcR6gVRuag';
            const orderId = await this.paymentContract.payOrder("1", nodeWalletAddress, proof);
            this.log(`pay order successfully: ${orderId}.`);
        });
    }

    async getOrders() {
        await this.initPaymentContract();
        await this.updateMessage(async () => {
            const orders = await this.paymentContract.getOrders();
            this.log(`getOrders() successfully: ${orders}`);
        });
    }

    async getOrderByIndex() {
        await this.initPaymentContract();
        await this.updateMessage(async () => {
            const order = await this.paymentContract.getOrderByIndex(0);
            this.log(`getOrderByIndex() successfully: ${order}`);
        });
    }

    async getOrderCount() {
        await this.initPaymentContract();
        await this.updateMessage(async () => {
            const count = await this.paymentContract.getOrderCount();
            this.log(`getOrderCount() successfully: ${count}`);
        });
    }

    async getOrder() {
        await this.initPaymentContract();
        await this.updateMessage(async () => {
            const orderId = 0;
            const order = await this.paymentContract.getOrder(orderId);
            this.log(`getOrder() successfully: ${order}`);
        });
    }

    async getPlatformFee() {
        await this.initPaymentContract();
        await this.updateMessage(async () => {
            const result = await this.paymentContract.getPlatformFee();
            this.log(`getPlatformFee() successfully: ${JSON.stringify(result)}`);
        });
    }

    private static getIncreasedDays(start: Date, end: Date): number {
        const startTime: number = start == null ? Date.now() : start.getTime();
        const endTime: number = end == null ? Date.now() : end.getTime();
        return (endTime - startTime) / 1000 / 24 / 3600; // days
    }

    private log(msg) {
        console.log(`[tab1.page.ts] >>>>>> ${msg}`)
    }

    /**
     * This example shows how to upgrade a vault by payment service.
     *
     * The process is like this:
     *
     *      1. create a new vault or keep the exist one.
     *      2. place order and get the payment info.
     *      3. pay order by wallet app (essentials or metamask) with hive payment js sdk and get order id.
     *      4. setter order by the order id and the vault will be upgrade (more max storage size and duration time)
     *      5. all done. The upgraded vault can be used now.
     */
    async upgradeVault() {
        await this.initPaymentContract();
        await this.updateMessage(async () => {
            const vault = await this.getVault();

            const subscription = await vault.createVaultSubscription();
            // try subscribe
            try {
                const info = await subscription.subscribe();
                this.log(`subscribe done: ${JSON.stringify(info)}`);
            } catch (e) {
                if (e instanceof AlreadyExistsException) {
                    this.log('the vault already exists');
                } else {
                    throw e;
                }
            }

            // vault info before upgrading
            const vaultInfoBefore: VaultInfo = await subscription.checkSubscription();
            this.log(`vault info before: ${JSON.stringify(vaultInfoBefore)}`);

            // place order
            const order: Order = await subscription.placeOrder('Rookie');
            this.log(`place order: ${JSON.stringify(order)}.`);

            // pay order by payment SDK
            const amount = order.getPaymentAmount().toString();
            const to = order.getReceivingAddress(); // wallet address
            const memo = order.getProof();
            const orderId = await this.paymentContract.payOrder(amount, to, memo);
            this.log(`pay order: ${orderId}.`);

            // settle order
            const receipt: Receipt = await subscription.settleOrder(orderId);
            this.log(`settle order: ${JSON.stringify(receipt)}.`);

            // vault info after upgrading
            const vaultInfoAfter = await subscription.checkSubscription();
            this.log(`vault info after: ${JSON.stringify(vaultInfoAfter)}`);

            const afterPlanName = vaultInfoAfter.getPricePlan();
            const maxSize = vaultInfoAfter.getStorageQuota();
            const increasedDays = Tab1Page.getIncreasedDays(vaultInfoBefore.getEndTime(), vaultInfoAfter.getEndTime());
            this.log(`upgrade with result: afterPlanName=${afterPlanName}, maxSize=${maxSize}(Bytes), increasedDays=${increasedDays}(days)`);

            this.log('upgrade is done !!!')
        });
    }
}
