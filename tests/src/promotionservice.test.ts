import { TestData } from "./config/testdata";
import { VaultServices, VaultSubscriptionService, DatabaseService, AlreadyExistsException, InsertOptions, FindOptions, NotFoundException, QueryOptions, AscendingSortItem, CountOptions, PromotionService } from "@elastosfoundation/elastos-hive-js-sdk";
import { ClientConfig } from "./config/clientconfig";


describe("test database services", () => {
   
    let testData: TestData;
    let vaultSubscriptionService: VaultSubscriptionService;
    let vaultServices: VaultServices;
    let promotionService: PromotionService;
   

    beforeAll(async () => {

        let testData = await TestData.getInstance("databaseservice.tests", ClientConfig.CUSTOM, TestData.USER_DIR);

        vaultServices = new VaultServices(
            testData.getAppContext(),
            testData.getProviderAddress());

        
        promotionService = vaultServices.getPromotionService();
    });


    test("testPromote", async () => {
        await expect(promotionService.promote()).resolves.not.toThrow();
        
    });

});
