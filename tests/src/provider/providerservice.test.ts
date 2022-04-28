import {BackupSubscription, NotFoundException, VaultSubscription,
    Provider, VaultDetail, BackupDetail, FilledOrderDetail} from "@elastosfoundation/hive-js-sdk";
import {TestData} from "../config/testdata";

describe("test provider service", () => {
    let testData: TestData;
    let vaultSubscription: VaultSubscription;
    let backupSubscription: BackupSubscription;
    let provider: Provider;

    beforeAll(async () => {
        testData = await TestData.getInstance("providerservice.test");
        vaultSubscription = new VaultSubscription(testData.getAppContext(), testData.getProviderAddress());
        backupSubscription = new BackupSubscription(testData.getAppContext(), testData.getProviderAddress());
        provider = testData.createProviderService();
        try {
            await vaultSubscription.subscribe();
        } catch (e) {
            console.log('Init with subscribe error, maybe already exists.');
        }
        try {
            await backupSubscription.subscribe();
        } catch (e) {
            console.log('Init with subscribe error, maybe already exists.');
        }
    });

    test("test get vaults", async () => {
        let vaults: VaultDetail[] = await provider.getVaults();
        expect(vaults).not.toBeNull();
        expect(vaults).not.toEqual([]);
    });

    test("test get backups", async () => {
        try {
            let backups: BackupDetail[] = await provider.getBackups();
            expect(backups).not.toBeNull();
            expect(backups).not.toEqual([]);
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
        }
    });

    test.skip("test get filled orders", async () => {
        try {
            let orders: FilledOrderDetail[] = await provider.getFilledOrders();
            expect(orders).not.toBeNull();
            expect(orders).not.toEqual([]);
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
        }
    });
});
