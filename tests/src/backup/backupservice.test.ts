import { BackupService, AlreadyExistsException, VaultSubscriptionService } from "@elastosfoundation/hive-js-sdk";
import { TestData } from "../config/testdata"


describe("test backup services", () => {

    let backupService: BackupService;

    beforeAll(async () => {
        const testData = await TestData.getInstance("backupservice.tests");
        backupService = testData.getBackupService();
        try {
            const vaultSubscriptionService = new VaultSubscriptionService(
                testData.getAppContext(),
                testData.getProviderAddress());
            await vaultSubscriptionService.subscribe();
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
        let result = await backupService.checkResult();
        expect(result.state).not.toBeNull();
        expect(result.result).not.toBeNull();
    });

});
