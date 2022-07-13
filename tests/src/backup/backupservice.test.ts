import {
    BackupService,
    AlreadyExistsException,
    VaultSubscription,
    Logger,
    VaultNotFoundException,
    FilesService, BackupSubscription, BackupNotFoundException
} from "../../../src";
import { TestData } from "../config/testdata"
import { randomBytes } from "crypto";


jest.setTimeout(30 * 60 * 1000);


describe("test backup services", () => {
    const LOG = new Logger('backupservice.test');

    let filesService: FilesService;
    let backupService: BackupService;

    beforeAll(async () => {
        const testData = await TestData.getInstance("backupservice.tests");
        backupService = testData.getBackupService();
        filesService = testData.newVault().getFilesService();
        const vaultSubscription = new VaultSubscription(testData.getUserAppContext(), testData.getProviderAddress());
        const backupSubscription = new BackupSubscription(testData.getUserAppContext(), testData.getTargetProviderAddress());

        // try to remove the vault.
        try {
            await vaultSubscription.unsubscribe();
        } catch (e) {
            if (!(e instanceof VaultNotFoundException)) {
                throw e;
            }
        }

        // create an empty vault.
        try {
            await vaultSubscription.subscribe();
        } catch (e) {
            if (!(e instanceof AlreadyExistsException)) {
                throw e;
            }
        }

        // try to remove the backup service.
        try {
            await backupSubscription.unsubscribe();
        } catch (e) {
            if (!(e instanceof BackupNotFoundException)) {
                throw e;
            }
        }

        // create backup service.
        try {
            await backupSubscription.subscribe();
        } catch (e) {
            if (!(e instanceof AlreadyExistsException)) {
                throw e;
            }
        }
    });

    test.skip("testStartBackup", async () => {
        await backupService.startBackup();
    });

    test("testStartBackupWithCallback", async () => {
        await backupService.startBackup(function (state, message, e) {
            console.log('backup callback: {}, {}, {}', state, message, e);
        });
    });

    async function uploadManyFiles(count) {  // count * 10MB
        const fileNamePrefix = 'backup_file_';
        const uploadStart = new Date().getTime();

        for (let i = 0; i < count; i++) {
            const buffer: Buffer = randomBytes(10 * 1024 * 1024 + i + 1);
            await filesService.upload(`${fileNamePrefix}${i}.bin`, buffer, (process => {
                console.log(`uploading file ${fileNamePrefix}${i}.bin: ${process}`)
            }), true, `public_file_${i}`);
        }

        const uploadEnd = new Date().getTime();
        console.log(`cost of uploading: ${uploadEnd - uploadStart}ms`);
    }

    async function backupManyFiles() {
        const start = new Date().getTime();

        await backupService.startBackup(function (state, message, e) {
            console.log('backup callback: {}, {}, {}', state, message, e);
        });

        const end = new Date().getTime();
        console.log(`cost of backup: ${end - start}ms`);
    }

    test.skip("testWithDifferentUsage", async () => {
        // backup with different file sizes, every file is 10MB.
        await uploadManyFiles(10);
        await backupManyFiles();
    });

    test.skip("testRestoreFrom", async () => {
        await backupService.restoreFrom(function (state, message, e) {
            console.log('restore callback: {}, {}, {}', state, message, e);
        });
    });

    test("testCheckResult", async () => {
        let result = await backupService.checkResult();
        expect(result.getState()).not.toBeNull();
        expect(result.getResult()).not.toBeNull();
    });

});
