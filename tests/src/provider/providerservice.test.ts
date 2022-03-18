import {BackupSubscriptionService, NotFoundException, VaultSubscriptionService,
    ProviderService, VaultDetail, BackupDetail, FilledOrderDetail} from "@elastosfoundation/hive-js-sdk";
import {TestData} from "../config/testdata";

describe("test provider service", () => {
    let testData: TestData;
    let vaultSubscriptionService: VaultSubscriptionService;
    let backupSubscriptionService: BackupSubscriptionService;
    let providerService: ProviderService;

    beforeAll(async () => {
        testData = await TestData.getInstance("providerservice.test");
        vaultSubscriptionService = new VaultSubscriptionService(testData.getAppContext(), testData.getProviderAddress());
        backupSubscriptionService = new BackupSubscriptionService(testData.getAppContext(), testData.getProviderAddress());
        providerService = testData.createProviderService();
        try {
            await vaultSubscriptionService.subscribe();
        } catch (e) {
            console.log('Init with subscribe error, maybe already exists.');
        }
        try {
            await backupSubscriptionService.subscribe();
        } catch (e) {
            console.log('Init with subscribe error, maybe already exists.');
        }
    });

    test("test get vaults", async () => {
        let vaults: VaultDetail[] = await providerService.getVaults();
        expect(vaults).not.toBeNull();
        expect(vaults).not.toEqual([]);
    });

    test("test get backups", async () => {
        try {
            let backups: BackupDetail[] = await providerService.getBackups();
            expect(backups).not.toBeNull();
            expect(backups).not.toEqual([]);
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
        }
    });

    test.skip("test get filled orders", async () => {
        try {
            let orders: FilledOrderDetail[] = await providerService.getFilledOrders();
            expect(orders).not.toBeNull();
            expect(orders).not.toEqual([]);
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
        }
    });
});
