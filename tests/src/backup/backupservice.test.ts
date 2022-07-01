import { BackupService, AlreadyExistsException, VaultSubscription, Logger } from "../../../src";
import { TestData } from "../config/testdata"


describe("test backup services", () => {
    const LOG = new Logger('backupservice.test');

    let backupService: BackupService;

    beforeAll(async () => {
        const testData = await TestData.getInstance("backupservice.tests");
        backupService = testData.getBackupService();
        try {
            const vaultSubscription = new VaultSubscription(
                testData.getUserAppContext(),
                testData.getProviderAddress());
            await vaultSubscription.subscribe();
        } catch (e) {
            if (!(e instanceof AlreadyExistsException)) {
                throw e;
            }
        }
    });

    test.skip("testStartBackup", async () => {
        await backupService.startBackup();
    });

    test.skip("testStartBackupWithCallback", async () => {
        await backupService.startBackup(function (state, message, e) {
            console.log('backup callback: {}, {}, {}', state, message, e);
        });
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
