import {
    VaultSubscription, DatabaseService, AlreadyExistsException,
    InsertOptions, CollectionNotFoundException, NodeRPCException
} from "../../../src";
import { TestData } from "../config/testdata";

describe("test database services", () => {
    let COLLECTION_NAME = "encrypt_works";

    let vaultSubscription: VaultSubscription;
    let databaseService: DatabaseService;

    beforeAll(async () => {
        let testData = await TestData.getInstance("databaseservice.tests");
        vaultSubscription = new VaultSubscription(testData.getUserAppContext(), testData.getProviderAddress());
        databaseService = testData.newVault().getDatabaseEncryptionService();

        // try to subscribe a vault if not exists.
        try {
            await vaultSubscription.subscribe();
        } catch (e) {
            if (e instanceof NodeRPCException) {
                if (e instanceof AlreadyExistsException) {
                    console.log("vault is already subscribed");
                } else {
                    console.log("unexpected hive js exception");
                    throw e;
                }
            } else {
                console.log("not got a hive js exception");
            }
        }
    });

    test("testCreateCollection", async () => {
        await deleteCollectionAnyway();
        await expect(databaseService.createCollection(COLLECTION_NAME)).resolves.not.toThrow();
    });

    test("testInsertOne", async () => {
        let docNode = new Map();
        docNode['author'] = 'john doe1';
        docNode['title'] = 'Eve for Dummies1';
        docNode['words_count'] = 10000;
        docNode['published'] = true;

        let result = await databaseService.insertOne(COLLECTION_NAME, docNode, new InsertOptions(false, false, true));
        expect(result).not.toBeNull();
        expect(result.getInsertedIds().length).toEqual(1);
    });

    async function deleteCollectionAnyway() {
        try {
            await databaseService.deleteCollection(COLLECTION_NAME);
        } catch (e) {
            if (e instanceof CollectionNotFoundException) {
                // pass
            } else {
                throw e;
            }
        }
    }
});
