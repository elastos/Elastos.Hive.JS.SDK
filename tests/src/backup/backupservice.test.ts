import { BackupService, AlreadyExistsException, VaultSubscription, Vault } from "../../../src";
import { TestData } from "../config/testdata"


describe("test backup services", () => {

    let testData: TestData;
    let vaultSubscription: VaultSubscription;
    let backupService: BackupService;

    beforeAll(async () => {
        testData = await TestData.getInstance("backupservice.tests");
        try {
            vaultSubscription = new VaultSubscription(
                testData.getAppContext(),
                testData.getProviderAddress());
            await vaultSubscription.subscribe();
        } catch (e) {
            if (!(e instanceof AlreadyExistsException)) {
                throw e;
            }
        }
        backupService = testData.newVault().getBackupService();
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
