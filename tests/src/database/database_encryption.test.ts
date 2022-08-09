import {
    VaultSubscription, DatabaseService, AlreadyExistsException,
    InsertOptions, CollectionNotFoundException, NodeRPCException, UpdateOptions
} from "../../../src";
import { TestData } from "../config/testdata";
import {JSONObject} from "@elastosfoundation/did-js-sdk";

describe("test database services", () => {
    let COLLECTION_NAME = "encrypt_works";

    let vaultSubscription: VaultSubscription;
    let databaseService: DatabaseService;

    beforeAll(async () => {
        let testData = await TestData.getInstance("databaseservice.tests");
        vaultSubscription = new VaultSubscription(testData.getUserAppContext(), testData.getProviderAddress());
        databaseService = testData.newVault().getEncryptionDatabaseService();

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

    test("testFindMany", async () => {
        const filter = { "author": "john doe1" };
        const updateNode = { "$set": { "title": "Eve for Dummies2" } };
        await expect(databaseService.updateOne(COLLECTION_NAME, filter, updateNode, new UpdateOptions(false, true))).resolves.not.toBeNull();

        const docs: JSONObject[] = await databaseService.findMany(COLLECTION_NAME, filter);
        expect(docs).toBeTruthy();
        expect(docs).not.toBeUndefined();
        expect(docs).not.toBeNull();
        expect(docs.length).toBe(1);
        expect(docs[0]['author']).toEqual('john doe1');
        expect(docs[0]['title']).toEqual('Eve for Dummies2');
        expect(docs[0]['words_count']).toEqual(10000);
        expect(docs[0]['published']).toEqual(true);
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
