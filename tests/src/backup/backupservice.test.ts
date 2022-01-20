import { BackupService } from "../../../src";
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata"


describe("test backup services", () => {

    let backupService: BackupService;

    beforeAll(async () => {
        const testData = await TestData.getInstance("backupservice.tests", ClientConfig.CUSTOM, TestData.USER_DIR);
        backupService = testData.getBackupService();
    });

    test("testStartBackup", async () => {
        await backupService.startBackup();
    });

    test.skip("testRestoreFrom", async () => {
        await backupService.restoreFrom();
    });

    test("testCheckResult", async () => {
        await backupService.checkResult();
    });

});
