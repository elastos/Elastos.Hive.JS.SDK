import {BackupSubscriptionService, NotFoundException, VaultSubscriptionService} from "../../../src";
import {TestData} from "../config/testdata";
import {ClientConfig} from "../config/clientconfig";
import {ProviderService} from "../../../src/restclient/provider/providerservice";
import {VaultDetail} from "../../../src/restclient/provider/vaultdetail";
import {BackupDetail} from "../../../src/restclient/provider/backupdetail";
import {FilledOrderDetail} from "../../../src/restclient/provider/filledorderdetail";

describe("test provider service", () => {
    let testData: TestData;
    let vaultSubscriptionService: VaultSubscriptionService;
    let backupSubscriptionService: BackupSubscriptionService;
    let providerService: ProviderService;

    beforeAll(async () => {
        testData = await TestData.getInstance("providerservice.test", ClientConfig.CUSTOM, TestData.USER_DIR);
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
        let backups: BackupDetail[] = await providerService.getBackups();
        expect(backups).not.toBeNull();
        expect(backups).not.toEqual([]);
    });

    test("test get filled orders", async () => {
        try {
            let orders: FilledOrderDetail[] = await providerService.getFilledOrders();
            expect(orders).not.toBeNull();
            expect(orders).not.toEqual([]);
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
        }
    });
});
