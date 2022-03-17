import { BackupService } from "@elastosfoundation/hive-js-sdk";
import { TestData } from "../config/testdata"


describe("test backup services", () => {

    let backupService: BackupService;

    beforeAll(async () => {
        const testData = await TestData.getInstance("backupservice.tests");
        backupService = testData.getBackupService();
    });

    test("testStartBackup", async () => {
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
