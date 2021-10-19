import { VaultServices, VaultSubscriptionService, DatabaseService, AlreadyExistsException, InsertOptions, FindOptions, NotFoundException } from "@elastosfoundation/elastos-hive-js-sdk";
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

describe("test database services", () => {
   
    let testData: TestData;
    let vaultSubscriptionService: VaultSubscriptionService;
    let vaultServices: VaultServices;
    let databaseService: DatabaseService;

    // 	private static final Logger log = LoggerFactory.getLogger(DatabaseServiceTest.class);
    let COLLECTION_NAME = "works";
    let COLLECTION_NAME_NOT_EXIST = "works_not_exists";

    beforeAll(async () => {

        let testData = await TestData.getInstance("databaseservice.tests", ClientConfig.CUSTOM, TestData.USER_DIR);

        vaultSubscriptionService = new VaultSubscriptionService(
            testData.getAppContext(),
            testData.getProviderAddress());
        
        try {
            await vaultSubscriptionService.subscribe();    
        } catch (e){
            console.log("vault is already subscribed");
        }


        vaultServices = new VaultServices(
            testData.getAppContext(),
            testData.getProviderAddress());

        
        databaseService = vaultServices.getDatabaseService();
    });

    test("testCreateCollection", async () => {
        await deleteCollectionAnyway();
        await expect(databaseService.createCollection(COLLECTION_NAME)).resolves.not.toThrow();
        
    });

    test("testCreateCollection4AlreadyExistsException", async () => {
        let collectionName = `collection_${Date.now().toString()}`; 
        await databaseService.createCollection(collectionName);
        await expect(databaseService.createCollection(collectionName)).rejects.toThrow(AlreadyExistsException);
    });   

    test("testInsertOne", async () => {
        let docNode = {"author": "john doe1", "title": "Eve for Dummies1"};
        let result = await databaseService.insertOne(COLLECTION_NAME, docNode, new InsertOptions(false, false).getBypassDocumentValidation(false));
        expect(result).not.toBeNull();
        expect(result.inserted_ids.length).toEqual(1);

    });

    test("testInsertOne4NotFoundException", async () => {
        let docNode = {"author": "john doe1", "title": "Eve for Dummies1"};
        await expect(databaseService.insertOne(COLLECTION_NAME_NOT_EXIST, docNode, new InsertOptions(false, false).getBypassDocumentValidation(false)))
            .rejects.toThrow(NotFoundException);
 	});

     test("testInsertMany", async () => {
        
        let nodes = [{"author": "john doe2", "title": "Eve for Dummies2"},
                     {"author": "john doe3", "title": "Eve for Dummies3"}];

        let result = await databaseService.insertMany(COLLECTION_NAME, nodes, new InsertOptions(false, true)); 
        expect(result).not.toBeNull();
        expect(result.inserted_ids.length).toEqual(2);

    });

    test("testInsertManyNotFound", async () => {
        
        let nodes = [{"author": "john doe2", "title": "Eve for Dummies2"},
                     {"author": "john doe3", "title": "Eve for Dummies3"}];

        await expect(databaseService.insertMany(COLLECTION_NAME_NOT_EXIST, nodes, new InsertOptions(false, false))).rejects.toThrow(NotFoundException); 
    });

    test("testFindOne", async () => {
        //setup
        let collectionName = TestData.getUniqueName("testFindOne");
        await databaseService.createCollection(collectionName);

        let nodes = {"author": "john doe1", "title": "Eve for Dummies1"};
        await expect(databaseService.insertOne(collectionName, nodes, new InsertOptions(false, false))).resolves.not.toThrow(); 


        let query = {"author": "john doe1"};
        let result = await databaseService.findOne(collectionName, query, (new FindOptions()).setSkip(0).setLimit(0));
        expect(result).not.toBeNull();
    });


    async function deleteCollectionAnyway() {
        await expect(databaseService.deleteCollection(COLLECTION_NAME)).resolves.not.toThrow();
    }
   
});



// package org.elastos.hive;

// import com.fasterxml.jackson.databind.JsonNode;
// import com.fasterxml.jackson.databind.node.JsonNodeFactory;
// import com.fasterxml.jackson.databind.node.ObjectNode;
// import org.elastos.hive.config.TestData;
// import org.elastos.hive.exception.AlreadyExistsException;
// import org.elastos.hive.exception.NotFoundException;
// import org.elastos.hive.service.DatabaseService;
// import org.elastos.hive.vault.database.*;
// import org.junit.jupiter.api.*;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;

// import java.util.*;
// import java.util.concurrent.ExecutionException;

// @TestMethodOrder(MethodOrderer.OrderAnnotation.class)
// class DatabaseServiceTest {
// 	private static final Logger log = LoggerFactory.getLogger(DatabaseServiceTest.class);
// 	private static final String COLLECTION_NAME = "works";
// 	private static final String COLLECTION_NAME_NOT_EXIST = "works_not_exists";

// 	private static DatabaseService databaseService;

// 	@BeforeAll public static void setUp() {
// 		Assertions.assertDoesNotThrow(()->databaseService = TestData.getInstance()
// 				.newVault().getDatabaseService());
// 	}

// 	private void deleteCollectionAnyway() {
// 		try {
// 			databaseService.deleteCollection(COLLECTION_NAME).get();
// 		} catch (Exception e) {
// 			log.info("deleteCollectionAnyway() with exception: " + e.getMessage());
// 		}
// 	}

// 	@Test @Order(1) void testCreateCollection() {
// 		deleteCollectionAnyway();
// 		Assertions.assertDoesNotThrow(()->{
// 			databaseService.createCollection(COLLECTION_NAME).get();
// 		});
// 	}

// 	@Test @Order(2) void testCreateCollection4AlreadyExistsException() {
// 		ExecutionException e = Assertions.assertThrows(ExecutionException.class,
// 				() -> databaseService.createCollection(COLLECTION_NAME).get());
// 		Assertions.assertEquals(e.getCause().getClass(), AlreadyExistsException.class);
// 	}

// 	@Test @Order(2) void testInsertOne() {
// 		Assertions.assertDoesNotThrow(()->{
// 			ObjectNode docNode = JsonNodeFactory.instance.objectNode();
// 			docNode.put("author", "john doe1");
// 			docNode.put("title", "Eve for Dummies1");
// 			Assertions.assertNotNull(databaseService.insertOne(COLLECTION_NAME, docNode,
// 					new InsertOptions().bypassDocumentValidation(false)).get());
// 		});
// 	}

// 	@Test @Order(2) void testInsertOne4NotFoundException() {
// 		ObjectNode docNode = JsonNodeFactory.instance.objectNode();
// 		docNode.put("author", "john doe1");
// 		docNode.put("title", "Eve for Dummies1");
// 		ExecutionException e = Assertions.assertThrows(ExecutionException.class,
// 				() -> databaseService.insertOne(COLLECTION_NAME_NOT_EXIST, docNode,
// 						new InsertOptions().bypassDocumentValidation(false)).get());
// 		Assertions.assertEquals(e.getCause().getClass(), NotFoundException.class);
// 	}

// 	@Test @Order(3) void testInsertMany() {
// 		Assertions.assertDoesNotThrow(()->{
// 			List<JsonNode> nodes = new ArrayList<>();

// 			ObjectNode doc = JsonNodeFactory.instance.objectNode();
// 			doc.put("author", "john doe2");
// 			doc.put("title", "Eve for Dummies2");
// 			nodes.add(doc);

// 			doc.removeAll();

// 			doc = JsonNodeFactory.instance.objectNode();
// 			doc.put("author", "john doe3");
// 			doc.put("title", "Eve for Dummies3");
// 			nodes.add(doc);

// 			Assertions.assertNotNull(databaseService.insertMany(COLLECTION_NAME, nodes,
// 					new InsertOptions().bypassDocumentValidation(false).ordered(true)).get());
// 		});
// 	}

// 	@Test @Order(3) void testInsertMany4NotFoundException() {
// 		List<JsonNode> nodes = new ArrayList<>();

// 		ObjectNode doc = JsonNodeFactory.instance.objectNode();
// 		doc.put("author", "john doe2");
// 		doc.put("title", "Eve for Dummies2");
// 		nodes.add(doc);

// 		doc.removeAll();

// 		doc = JsonNodeFactory.instance.objectNode();
// 		doc.put("author", "john doe3");
// 		doc.put("title", "Eve for Dummies3");
// 		nodes.add(doc);
// 		ExecutionException e = Assertions.assertThrows(ExecutionException.class,
// 				() -> databaseService.insertMany(COLLECTION_NAME_NOT_EXIST, nodes,
// 						new InsertOptions().bypassDocumentValidation(false)).get());
// 		Assertions.assertEquals(e.getCause().getClass(), NotFoundException.class);
// 	}

// 	@Test @Order(4) void testFindOne() {
// 		Assertions.assertDoesNotThrow(()->{
// 			ObjectNode query = JsonNodeFactory.instance.objectNode();
// 			query.put("author", "john doe1");
// 			Assertions.assertNotNull(databaseService.findOne(COLLECTION_NAME, query,
// 					new FindOptions().setSkip(0).setLimit(0)).get());
// 		});
// 	}

// 	@Test @Order(4) void testFindOne4NotFoundException() {
// 		// INFO: not raise exception for empty result of finding.
// 		ObjectNode query = JsonNodeFactory.instance.objectNode();
// 		query.put("author", "john doe1");
// 		ExecutionException e = Assertions.assertThrows(ExecutionException.class,
// 				() -> databaseService.findOne(COLLECTION_NAME_NOT_EXIST, query,
// 						new FindOptions().setSkip(0).setLimit(0)).get());
// 		Assertions.assertEquals(e.getCause().getClass(), NotFoundException.class);
// 	}

// 	@Test @Order(5) void testFindMany() {
// 		Assertions.assertDoesNotThrow(()->{
// 			ObjectNode query = JsonNodeFactory.instance.objectNode();
// 			query.put("author", "john doe1");
// 			List<JsonNode> docs = databaseService.findMany(COLLECTION_NAME, query,
// 					new FindOptions().setSkip(0).setLimit(0)).get();
// 		});
// 	}

// 	@Test @Order(5) void testFindMany4NotFoundException() {
// 		// INFO: not raise exception for empty result of finding.
// 		ObjectNode query = JsonNodeFactory.instance.objectNode();
// 		query.put("author", "john doe1");
// 		ExecutionException e = Assertions.assertThrows(ExecutionException.class,
// 				() -> databaseService.findMany(COLLECTION_NAME_NOT_EXIST, query,
// 						new FindOptions().setSkip(0).setLimit(0)).get());
// 		Assertions.assertEquals(e.getCause().getClass(), NotFoundException.class);
// 	}

// 	@Test @Order(6) void testQuery() {
// 		Assertions.assertDoesNotThrow(()->{
// 			ObjectNode query = JsonNodeFactory.instance.objectNode();
// 			query.put("author", "john doe1");
// 			Assertions.assertNotNull(databaseService.query(COLLECTION_NAME, query, null).get());
// 		});
// 	}

// 	@Test @Order(6) void testQuery4NotFoundException() {
// 		// INFO: not raise exception for empty result of querying.
// 		ObjectNode query = JsonNodeFactory.instance.objectNode();
// 		query.put("author", "john doe1");
// 		ExecutionException e = Assertions.assertThrows(ExecutionException.class,
// 				() -> databaseService.query(COLLECTION_NAME_NOT_EXIST, query, null).get());
// 		Assertions.assertEquals(e.getCause().getClass(), NotFoundException.class);
// 	}

// 	@Test @Order(6) void testQueryWithOptions() {
// 		Assertions.assertDoesNotThrow(()->{
// 			ObjectNode query = JsonNodeFactory.instance.objectNode();
// 			query.put("author", "john doe1");
// 			QueryOptions options = new QueryOptions().setSort(new AscendingSortItem("_id"));
// 			Assertions.assertNotNull(databaseService.query(COLLECTION_NAME, query, options).get());
// 		});
// 	}

// 	@Test @Order(7) void testCountDoc() {
// 		Assertions.assertDoesNotThrow(()->{
// 			ObjectNode filter = JsonNodeFactory.instance.objectNode();
// 			filter.put("author", "john doe1");
// 			Assertions.assertNotNull(databaseService.countDocuments(COLLECTION_NAME, filter,
// 					new CountOptions().setLimit(1L).setSkip(0L).setMaxTimeMS(1000000000L)).get());
// 		});
// 	}

// 	@Test @Order(7) void testCountDoc4NotFoundException() {
// 		ObjectNode filter = JsonNodeFactory.instance.objectNode();
// 		filter.put("author", "john doe1");
// 		ExecutionException e = Assertions.assertThrows(ExecutionException.class,
// 				() -> databaseService.countDocuments(COLLECTION_NAME_NOT_EXIST, filter,
// 						new CountOptions().setLimit(1L).setSkip(0L).setMaxTimeMS(1000000000L)).get());
// 		Assertions.assertEquals(e.getCause().getClass(), NotFoundException.class);
// 	}

// 	@Test @Order(8) void testUpdateOne() {
// 		Assertions.assertDoesNotThrow(()->{
// 			ObjectNode filter = JsonNodeFactory.instance.objectNode();
// 			filter.put("author", "john doe1");
// 			ObjectNode doc = JsonNodeFactory.instance.objectNode();
// 			doc.put("author", "john doe1");
// 			doc.put("title", "Eve for Dummies1_1");
// 			ObjectNode update = JsonNodeFactory.instance.objectNode();
// 			update.put("$set", doc);
// 			Assertions.assertNotNull(databaseService.updateOne(COLLECTION_NAME, filter, update,
// 					new UpdateOptions().setBypassDocumentValidation(false).setUpsert(true)).get());
// 		});
// 	}

// 	@Test @Order(8) void testUpdateOne4NotFoundException() {
// 		ObjectNode filter = JsonNodeFactory.instance.objectNode();
// 		filter.put("author", "john doe1");
// 		ObjectNode doc = JsonNodeFactory.instance.objectNode();
// 		doc.put("author", "john doe1");
// 		doc.put("title", "Eve for Dummies1_1");
// 		ObjectNode update = JsonNodeFactory.instance.objectNode();
// 		update.put("$set", doc);
// 		ExecutionException e = Assertions.assertThrows(ExecutionException.class,
// 				() -> databaseService.updateOne(COLLECTION_NAME_NOT_EXIST, filter, update,
// 						new UpdateOptions().setBypassDocumentValidation(false).setUpsert(true)).get());
// 		Assertions.assertEquals(e.getCause().getClass(), NotFoundException.class);
// 	}

// 	@Test @Order(9) void testUpdateMany() {
// 		Assertions.assertDoesNotThrow(()->{
// 			ObjectNode filter = JsonNodeFactory.instance.objectNode();
// 			filter.put("author", "john doe1");
// 			ObjectNode doc = JsonNodeFactory.instance.objectNode();
// 			doc.put("author", "john doe1");
// 			doc.put("title", "Eve for Dummies1_2");
// 			ObjectNode update = JsonNodeFactory.instance.objectNode();
// 			update.put("$set", doc);
// 			Assertions.assertNotNull(databaseService.updateMany(COLLECTION_NAME, filter, update,
// 					new UpdateOptions().setBypassDocumentValidation(false).setUpsert(true)).get());
// 		});
// 	}

// 	@Test @Order(9) void testUpdateMany4NotFoundException() {
// 		ObjectNode filter = JsonNodeFactory.instance.objectNode();
// 		filter.put("author", "john doe1");
// 		ObjectNode doc = JsonNodeFactory.instance.objectNode();
// 		doc.put("author", "john doe1");
// 		doc.put("title", "Eve for Dummies1_1");
// 		ObjectNode update = JsonNodeFactory.instance.objectNode();
// 		update.put("$set", doc);
// 		ExecutionException e = Assertions.assertThrows(ExecutionException.class,
// 				() -> databaseService.updateMany(COLLECTION_NAME_NOT_EXIST, filter, update,
// 						new UpdateOptions().setBypassDocumentValidation(false).setUpsert(true)).get());
// 		Assertions.assertEquals(e.getCause().getClass(), NotFoundException.class);
// 	}

// 	@Test @Order(10) void testDeleteOne() {
// 		Assertions.assertDoesNotThrow(()->{
// 			ObjectNode filter = JsonNodeFactory.instance.objectNode();
// 			filter.put("author", "john doe2");
// 			databaseService.deleteOne(COLLECTION_NAME, filter).get();
// 		});
// 	}

// 	@Test @Order(10) void testDeleteOne4NotFoundException() {
// 		ObjectNode filter = JsonNodeFactory.instance.objectNode();
// 		filter.put("author", "john doe2");
// 		ExecutionException e = Assertions.assertThrows(ExecutionException.class,
// 				() -> databaseService.deleteOne(COLLECTION_NAME_NOT_EXIST, filter).get());
// 		Assertions.assertEquals(e.getCause().getClass(), NotFoundException.class);
// 	}

// 	@Test @Order(11) void testDeleteMany() {
// 		Assertions.assertDoesNotThrow(()->{
// 			ObjectNode filter = JsonNodeFactory.instance.objectNode();
// 			filter.put("author", "john doe2");
// 			databaseService.deleteMany(COLLECTION_NAME, filter).get();
// 		});
// 	}

// 	@Test @Order(11) void testDeleteMany4NotFoundException() {
// 		ObjectNode filter = JsonNodeFactory.instance.objectNode();
// 		filter.put("author", "john doe2");
// 		ExecutionException e = Assertions.assertThrows(ExecutionException.class,
// 				() -> databaseService.deleteMany(COLLECTION_NAME_NOT_EXIST, filter).get());
// 		Assertions.assertEquals(e.getCause().getClass(), NotFoundException.class);
// 	}

// 	@Test @Order(12) void testDeleteCollection() {
// 		Assertions.assertDoesNotThrow(()->
// 				databaseService.deleteCollection(COLLECTION_NAME).get());
// 	}
// }