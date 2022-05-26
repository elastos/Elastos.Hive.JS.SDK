import { BackupService, AlreadyExistsException, VaultSubscription } from "@elastosfoundation/hive-js-sdk";
import { TestData } from "../config/testdata"


describe("test backup services", () => {

    let backupService: BackupService;

    beforeAll(async () => {
        const testData = await TestData.getInstance("backupservice.tests");
        backupService = testData.getBackupService();
        try {
            const vaultSubscription = new VaultSubscription(
                testData.getAppContext(),
                testData.getProviderAddress());
            await vaultSubscription.subscribe();
        } catch (e) {
            if (!(e instanceof AlreadyExistsException)) {
                throw e;
            }
        }
    });

    test("testCheckResult", async () => {
        let result = await backupService.checkResult();
        expect(result.getState()).not.toBeNull();
        expect(result.getResult()).not.toBeNull();
    });
    
    test.skip("testStartBackup", async () => {
        await backupService.startBackup();
    });

    test.skip("testRestoreFrom", async () => {
        await backupService.restoreFrom();
    });
});
