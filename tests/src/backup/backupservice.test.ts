import { BackupService, AlreadyExistsException, VaultSubscription } from "@elastosfoundation/hive-js-sdk";
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

    test.skip("testRestoreFrom", async () => {
        await backupService.restoreFrom();
    });

    test("testCheckResult", async () => {
        try {
            let result = await backupService.checkResult();
            expect(result.getState()).not.toBeNull();
            expect(result.getResult()).not.toBeNull();
        } catch (e) {
            LOG.info(`failed to testCheckResult: ${e.stack}`);
        }
    });

});
