import { InvalidParameterException, VaultSubscriptionService, DatabaseService, DeleteExecutable, InsertExecutable, FindExecutable, FileUploadExecutable, FileDownloadExecutable, FilePropertiesExecutable, FileHashExecutable, UpdateExecutable, ScriptingService, VaultServices, QueryHasResultCondition, FilesService, Executable, StreamResponseParser } from "@elastosfoundation/elastos-hive-js-sdk";

import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

describe("test scripting function", () => {

    let testData: TestData;
    let vaultSubscriptionService: VaultSubscriptionService;
    let vaultServices: VaultServices;
    let PRICING_PLAN_NAME = "Rookie";

    const FIND_NAME = "get_group_messages";
    const FIND_NO_CONDITION_NAME = "script_no_condition";
    const INSERT_NAME = "database_insert";
    const UPDATE_NAME = "database_update";
    const DELETE_NAME = "database_delete";
    const UPLOAD_FILE_NAME = "upload_file";
    const DOWNLOAD_FILE_NAME = "download_file";
    const FILE_PROPERTIES_NAME = "file_properties";
    const FILE_HASH_NAME = "file_hash";
    
    const COLLECTION_NAME = "script_database";
    const FILE_CONTENT = "this is test file abcdefghijklmnopqrstuvwxyz";

    let targetDid: string;
    let appDid: string;
    
    let filesService: FilesService;
    let databaseService: DatabaseService;
    let scriptingService: ScriptingService;
    
    let localSrcFilePath: string;
    let localDstFileRoot: string;
    let localDstFilePath: string;
    let fileName: string = "test.txt";

    beforeAll(async () => {
        testData = await TestData.getInstance("scriptingservice.test", ClientConfig.CUSTOM, TestData.USER_DIR);

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
        
        scriptingService = vaultServices.getScriptingService();
        filesService = testData.newVault().getFilesService();
        databaseService = testData.newVault().getDatabaseService();
        targetDid = testData.getUserDid();
        appDid = testData.getAppDid();

        await remove_test_database();
        await create_test_database();
    });

    afterAll(async () => {
        try {
            await remove_test_database();
            await vaultSubscriptionService.unsubscribe();
        } catch (e){
            console.log("vault is already unsubscribed");
        }
    });
    
	function expectBuffersToBeEqual(expected: Buffer, actual: Buffer): void {
        expect(actual).not.toBeNull();
        expect(actual).not.toBeUndefined();
		expect(actual.byteLength).toEqual(expected.byteLength);
		for (var i = 0 ; i != actual.byteLength ; i++)
		{
			if (actual[i] != expected[i]) {
				console.log(i + ": Actual: " + actual[i] + " Expected: " + expected[i]);
			}
			expect(actual[i]).toEqual(expected[i]);
		}
	}

    test("testInsert", async () => {
        await registerScriptInsert(INSERT_NAME);
        await callScriptInsert(INSERT_NAME);
    });

    test("testFindWithoutCondition", async () => {
        await registerScriptFindWithoutCondition(FIND_NO_CONDITION_NAME);
        await callScriptFindWithoutCondition(FIND_NO_CONDITION_NAME);
    });

    test("testFind", async () => {
        await registerScriptFind(FIND_NAME);
        await callScriptFind(FIND_NAME);
    });


    test("testUpdate", async () => {
        await registerScriptUpdate(UPDATE_NAME);
        await callScriptUpdate(UPDATE_NAME);
    });


    test("testDelete", async () => {

        let collectionName = "collectionToDelete";
        await create_test_database(collectionName);
        await registerScriptDelete(DELETE_NAME, collectionName);
        await callScriptDelete(DELETE_NAME);
    });

    test("testDownloadAndUpload", async () => {
        await registerScriptFileUpload(UPLOAD_FILE_NAME);
        let uploadTransactionId = await callScriptFileUpload(UPLOAD_FILE_NAME, "testDownloadUpload.txt");
        await uploadFileByTransActionId(uploadTransactionId, Buffer.from(FILE_CONTENT));
        await registerScriptFileDownload(DOWNLOAD_FILE_NAME);
        let downloadTransactionId = await callScriptFileDownload(DOWNLOAD_FILE_NAME, "testDownloadUpload.txt");
        let buffer = await downloadFileByTransActionId(downloadTransactionId);
        expectBuffersToBeEqual(Buffer.from(FILE_CONTENT), buffer);
    });

    test("testDownloadWithInvalidTransactionId", async () => {
        let expectedException;
        await registerScriptFileDownload(DOWNLOAD_FILE_NAME);
        let invalidTransactionId = "0000000";
        try {
            await downloadFileByTransActionId(invalidTransactionId);
        } catch (e) {
			expectedException = e;
		}
		expect(expectedException).toBeInstanceOf(InvalidParameterException);
    });
    
    test("testFileProperties", async () => {
        await registerScriptFileProperties(FILE_PROPERTIES_NAME);
        await callScriptFileProperties(FILE_PROPERTIES_NAME, "testDownloadUpload.txt");
    });

    test("testFileHash", async () => {
        await registerScriptFileHash(FILE_HASH_NAME);
        await callScriptFileHash(FILE_HASH_NAME, "testDownloadUpload.txt");
        await scriptingService.unregisterScript(FILE_HASH_NAME);
    });

    async function create_test_database(collectionName: string = COLLECTION_NAME) {
        try {
            await databaseService.createCollection(collectionName);
        } catch (e) {
            console.log(`Failed to create collection: ${e}`);
        }
    }

    /**
	 * If not exists, also return OK(_status).
	 */
	async function remove_test_database() {
		try {
			await databaseService.deleteCollection(COLLECTION_NAME);
		} catch (e) {
			console.error(`Failed to remove collection: ${e}`);
		}
    }
    
    async function registerScriptDelete( scriptName: string, collectionName: string = COLLECTION_NAME) {
        let filter = { "author": "$params.author" };
        let error;
        try {
            await scriptingService.registerScript(scriptName, 
                new DeleteExecutable(scriptName, collectionName, filter));
        } catch (e) {
            error = e;
        }
        expect(error).toBeUndefined();
    }


    async function registerScriptInsert(scriptName: string) {
        let doc = { "author": "$params.author", "content": "$params.content" };
        let options = { "bypass_document_validation": false, "ordered": true };
        await scriptingService.registerScript(scriptName,
                new InsertExecutable(scriptName, COLLECTION_NAME, doc, options));
    }
        
    async function callScriptInsert( scriptName: string) {
        
        let params = { "author": "John", "content": "message" }
        let result : DatabaseInsertResponse = await scriptingService.callScript<DatabaseInsertResponse>(scriptName, params, targetDid, appDid);

        expect(result).not.toBeNull();
        expect(result.database_insert).not.toBeNull();
        expect(result.database_insert.inserted_id).not.toBeNull();
    }

    async function registerScriptFindWithoutCondition(scriptName: string) {
        let filter = {"author":"John"};
        await scriptingService.registerScript(scriptName,
                    new FindExecutable(scriptName, COLLECTION_NAME, filter, null));
    }

    async function callScriptFindWithoutCondition( scriptName: string) {
        await expect(scriptingService.callScriptUrl<any>(scriptName, "{}", targetDid, appDid)).resolves.not.toBeNull();
    }
    
    async function registerScriptFind( scriptName: string) {
        let filter = { "author":"John" };
        await scriptingService.registerScript(scriptName,
                new FindExecutable(scriptName, COLLECTION_NAME, filter, null),
                new QueryHasResultCondition("verify_user_permission", COLLECTION_NAME, filter, null));
    }

    async function callScriptFind(scriptName: string) {
        await expect(scriptingService.callScript<any>(scriptName, {}, targetDid, appDid)).resolves.not.toBeNull();
    }

    async function registerScriptUpdate( scriptName: string) {
        let filter = {"author": "$params.author"};
        let set = {"author": "$params.author", "content": "$params.content" };
        let update = {"$set": set};
        let options = { "bypass_document_validation": false, "upsert": true};
        await scriptingService.registerScript(scriptName,
            new UpdateExecutable(scriptName, COLLECTION_NAME, filter, update, options));
    }

    async function callScriptUpdate( scriptName: string) {
        let params = {"author": "John", "content": "message" };
        let result = await scriptingService.callScript(scriptName, params, targetDid, appDid);

        expect(result).not.toBeNull();
        expect(result[scriptName]).not.toBeNull();
        expect(result[scriptName].upserted_id).not.toBeNull();
    }

    interface DatabaseDeleteResponse {
        database_delete: { acknowledged: boolean, deleted_count: number};
    }

    interface DatabaseInsertResponse {
        database_insert: { acknowledged: boolean, inserted_id: string};
    }

    async function callScriptDelete( scriptName: string) {
        let params =  {"author": "John"};
        let result: DatabaseDeleteResponse = await scriptingService.callScript<DatabaseDeleteResponse>(scriptName, params, targetDid, appDid);

        expect(result).not.toBeNull();
        expect(result[scriptName]).not.toBeNull();
        expect(result[scriptName].deleted_count).not.toBeNull();
    }
    
    async function registerScriptFileUpload(scriptName: string) {
        await scriptingService.registerScript(scriptName,
                 new FileUploadExecutable(scriptName).setOutput(true),
                 undefined,
                 false, false);
    }

    async function callScriptFileUpload(scriptName: string, fileName: string): Promise<string> {
        let result = await scriptingService.callScript<any>(scriptName,
                Executable.createRunFileParams(fileName),
                targetDid, appDid);
        expect(result).not.toBeNull();
        expect(result[scriptName]).not.toBeNull();

        console.log(JSON.stringify(result[scriptName]));
        expect(result[scriptName].transaction_id).not.toBeNull();
        return result[scriptName].transaction_id;
    }

    async function uploadFileByTransActionId( transactionId: string, content: any): Promise<void> {
        await scriptingService.uploadFile(transactionId, content);
    }
    
    async function registerScriptFileProperties( scriptName: string) {
        await scriptingService.registerScript(scriptName, 
            new FilePropertiesExecutable(scriptName).setOutput(true),
            undefined,
            false, false);
    }
        
    async function callScriptFileProperties(scriptName: string, fileName: string): Promise<void> {
        let result = await scriptingService.callScript<any>(scriptName,
            Executable.createRunFileParams(fileName),
            targetDid, appDid);
        expect(result).not.toBeNull();
        expect(result[scriptName]).not.toBeNull();
        expect(result[scriptName].size).not.toBeNull();
        expect(Number(result[scriptName].size) > 0);
    }
        
    async function registerScriptFileHash(scriptName: string) {
        await scriptingService.registerScript(scriptName,
            new FileHashExecutable(scriptName).setOutput(true));
    }

    async function callScriptFileHash(scriptName: string, fileName: string) {
        let result = await scriptingService.callScript(scriptName,
                Executable.createRunFileParams(fileName),
                targetDid, appDid);
        expect(result).not.toBeNull();
        expect(result[scriptName]).not.toBeNull();
        expect(result[scriptName].SHA256).not.toBeNull();
        expect(result[scriptName].SHA256.length).toBeGreaterThan(0);
    }
        
    async function registerScriptFileDownload( scriptName: string) {
        await scriptingService.registerScript(scriptName,
            new FileDownloadExecutable(scriptName).setOutput(true),
            undefined,
            false, false);
    }

	async function callScriptFileDownload(scriptName: string, fileName: string): Promise<string> {
        let result = await scriptingService.callScript(scriptName, 
            Executable.createRunFileParams(fileName),
            targetDid, appDid);
        expect(result).not.toBeNull();
        expect(result[scriptName]).not.toBeNull();
        expect(result[scriptName].transaction_id).not.toBeNull();
        return result[scriptName].transaction_id;
    }
	async function downloadFileByTransActionId(transactionId: string): Promise<Buffer> {
        return await scriptingService.downloadFile(transactionId);
	}
});
// describe.skip("test scripting service", () => {
    
//     let testData: TestData;
//     //let subscriptionService: VaultSubscriptionService;
//     const PRICING_PLAN_NAME: String = "Rookie";
//     //private static log = LoggerFactory.getLogger(ScriptingServiceTest.class);
//     const FIND_NAME = "get_group_messages";
//     const FIND_NO_CONDITION_NAME = "script_no_condition";
//     const INSERT_NAME = "database_insert";
//     const UPDATE_NAME = "database_update";
//     const DELETE_NAME = "database_delete";
//     const UPLOAD_FILE_NAME = "upload_file";
//     const DOWNLOAD_FILE_NAME = "download_file";
//     const FILE_PROPERTIES_NAME = "file_properties";
//     const FILE_HASH_NAME = "file_hash";
    
//     const COLLECTION_NAME = "script_database";
    
//     let targetDid: string;
//     let appDid: string;
    
//     let filesService: string;
//     let databaseService: DatabaseService;
//     let scriptingService: ScriptingService;
//     //let scriptRunner:  ScriptRunner;
    
//     let localSrcFilePath: string;
//     let localDstFileRoot: string;
//     let localDstFilePath: string;
//     let fileName: string;

    
//     function create_test_database() {
//         try {
//             //databaseService.createCollection(COLLECTION_NAME).get();
//         } catch (e) {
//             //log.error("Failed to create collection: {}", e.getMessage());
//         }
//     }

//     	/**
// 	 * If not exists, also return OK(_status).
// 	 */
// 	function remove_test_database() {
// 		try {
// 			//databaseService.deleteCollection(COLLECTION_NAME).get();
// 		} catch (e) {
// 			//log.error("Failed to remove collection: {}", e.getMessage());
// 		}
//     }
    
//     async function registerScriptDelete( scriptName: string) {
//         let filter = { "author": "$params.author" };
//         expect(await this.scriptingService.registerScript(scriptName, new DeleteExecutable(scriptName, COLLECTION_NAME, filter))).not.toThrow();
//     }

//     async function registerScriptInsert(scriptName: string) {
//         //Assertions.assertDoesNotThrow(() -> {
//         let doc = {"author": "$params.author", "content": "$params.content"};
//         let options = { "bypass_document_validation": false, "ordered": true};
//         await await this.scriptingService.registerScript(scriptName,
//                 new InsertExecutable(scriptName, COLLECTION_NAME, doc, options));
//     }

//     async function callScriptInsert( scriptName: string) {
       
//         let params = {"author":"John", "content": "message"}
//         let result = await this.scriptingService.callScript(scriptName, params, targetDid, appDid, undefined);
//         expect(result).not.toBeNull();
//         expect(result.has(scriptName)).toBeTruthy();
//         expect(result.get(scriptName).has("inserted_id")).toBeTruthy();
//     }

//     async function registerScriptFindWithoutCondition(scriptName: string) {
		
//         let filter = {"author":"John"};
//         await this.scriptingService.registerScript(scriptName,
//                  new FindExecutable(scriptName, COLLECTION_NAME, filter, null).setOutput(true));
	
// 	}

//     function callScriptFindWithoutCondition( scriptName: string) {
// 		//Assertions.assertDoesNotThrow(()->Assertions.assertNotNull(
// 		expect(this.scriptingService.callScriptUrl(scriptName, "{}", targetDid, appDid).get()).not.toBeNull();
//     }
    
//     async function registerScriptFind( scriptName: string) {
//         //Assertions.assertDoesNotThrow(()->{
//         let filter = { "author":"John" };
//         (await this.scriptingService.registerScript(scriptName,
//                 new QueryHasResultCondition("verify_user_permission", COLLECTION_NAME, filter, null),
//                 new FindExecutable(scriptName, COLLECTION_NAME, filter, null))).setOutput(true);
       
// 	}

// 	function callScriptFind(scriptName: string) {
// 		// Assertions.assertDoesNotThrow(()->{
// 		// 	Assertions.assertNotNull(
// 		expect(this.scriptingService.callScript(scriptName, null, this.targetDid, this.appDid).get()).not.toBeNull();
// 		// });
// 	}

//     async function registerScriptUpdate( scriptName: string) {
//  			let filter = {"author": "$params.author"};
//  			let set = {"author": "$params.author", "content": "$params.content" };
//  			let update = {"$set": set};
//             let options = { "bypass_document_validation": false, "upsert": true};
//  			expect(await this.scriptingService.registerScript(scriptName,
//  					new UpdateExecutable(scriptName, this.COLLECTION_NAME, filter, update, options))).not.toThrow();
//     }

//     async function callScriptUpdate( scriptName: string) {
//         let params = {"author": "John", "content": "message" };
//      	let result = await this.scriptingService.callScript(scriptName, params, this.targetDid, this.appDid, undefined);
//  		expect(result).not.toBeNull();
//         expect(result.has(scriptName)).toBeTruthy();
//         expect(result.get(scriptName).has("upserted_id")).toBeTruthy();
//  	}

// 	async function callScriptDelete( scriptName: string) {
// 		let params =  {"author": "John"};
// 		let result = await this.scriptingService.callScript(scriptName, params, this.targetDid, this.appDid, undefined);
// 		expect(result).not.toBeNull();
// 		expect(result.has(scriptName)).toBeTruthy();
// 		expect(result.get(scriptName).has("deleted_count")).toBeTruthy();
//     }
    
//     function registerScriptFileUpload(scriptName: string) {
// 		//Assertions.assertDoesNotThrow(() ->
//         // scriptingService.registerScript(scriptName,
//         //         new FileUploadExecutable(scriptName).setOutput(true),
//         //         false, false).get());
//     }
    
//     function callScriptFileUpload(scriptName: string, fileName: string) {
// // 		try {
// // 			JsonNode result = scriptRunner.callScript(scriptName,
// // 					Executable.createRunFileParams(fileName),
// // 					targetDid, appDid, JsonNode.class).get();
// // 			Assertions.assertNotNull(result);
// // 			Assertions.assertTrue(result.has(scriptName));
// // 			Assertions.assertTrue(result.get(scriptName).has("transaction_id"));
// // 			return result.get(scriptName).get("transaction_id").textValue();
// // 		} catch (Exception e) {
// // 			Assertions.fail(Throwables.getStackTraceAsString(e));
// // 			return null;
// // 		}
// // 	}

// 	function uploadFileByTransActionId( transactionId: string) {
// 		// try (Writer writer = scriptRunner.uploadFile(transactionId, Writer.class).get();
// 		// 	 FileReader fileReader = new FileReader(localSrcFilePath)) {
// 		// 	Assertions.assertNotNull(writer);
// 		// 	char[] buffer = new char[1];
// 		// 	while (fileReader.read(buffer) != -1) {
// 		// 		writer.write(buffer);
// 		// 	}
// 		// } catch (Exception e) {
// 		// 	Assertions.fail(Throwables.getStackTraceAsString(e));
// 		// }
//     }
    
//     function registerScriptFileProperties( scriptName: string) {
// 		//Assertions.assertDoesNotThrow(() ->
//         // scriptingService.registerScript(scriptName,
//         //         new FilePropertiesExecutable(scriptName).setOutput(true),
//         //         false, false).get());
// 	}

//     function callScriptFileProperties(scriptName: string, fileName: string) {
// // 		Assertions.assertDoesNotThrow(()->{
// // 			JsonNode result = scriptRunner.callScript(scriptName,
// // 					Executable.createRunFileParams(fileName),
// // 					targetDid, appDid, JsonNode.class).get();
// // 			Assertions.assertNotNull(result);
// // 			Assertions.assertTrue(result.has(scriptName));
// // 			Assertions.assertTrue(result.get(scriptName).has("size"));
// // 			Assertions.assertTrue(result.get(scriptName).get("size").asInt(0) > 0);
// // 		});
//     }

//     async function registerScriptFileHash(scriptName: string) {
// 		expect(await this.scriptingService.registerScript(scriptName,
// 						new FileHashExecutable(scriptName).setOutput(true))).not.toThrow();
//     }

//     function callScriptFileHash(scriptName: string, fileName: string) {
//         // Assertions.assertDoesNotThrow(()->{
//         //     JsonNode result = scriptRunner.callScript(scriptName,
//         //             Executable.createRunFileParams(fileName),
//         //             targetDid, appDid, JsonNode.class).get();
//         //     Assertions.assertNotNull(result);
//         //     Assertions.assertTrue(result.has(scriptName));
//         //     Assertions.assertTrue(result.get(scriptName).has("SHA256"));
//         //     Assertions.assertNotEquals(result.get(scriptName).get("SHA256").asText(""), "");
//         // });
//     }

// 	function registerScriptFileDownload( scriptName: string) {
// 		// expect(scriptingService.registerScript(scriptName,
// 		// 				new FileDownloadExecutable(scriptName).setOutput(true),
// 		// 				false, false).get()).not.toThrow();
// 	}

//     beforeAll(async () => {
//         let testData = await TestData.getInstance(ClientConfig.DEV, "/home/diego/temp");
//         this.scriptingService = testData.newVault().getScriptingService();
//         //scriptRunner = testData.newScriptRunner();
//         this.filesService = testData.newVault().getFilesService();
//         this.databaseService = testData.newVault().getDatabaseService();
//         this.targetDid = testData.getUserDid();
//         this.appDid = testData.getAppDid();
//     });


//     test.skip("testInsert", async () => {
//         this.remove_test_database();
//         this.create_test_database();
//         this.registerScriptInsert(this.INSERT_NAME);
//         this.callScriptInsert(this.INSERT_NAME);
//     });

//     test.skip("testFindWithoutCondition", async () => {
//         this.registerScriptFindWithoutCondition(this.FIND_NO_CONDITION_NAME);
// 		this.callScriptFindWithoutCondition(this.FIND_NO_CONDITION_NAME);
//     });

//     test.skip("testFind", async () => {
//         this.registerScriptFind(this.FIND_NAME);
//         this.callScriptFind(this.FIND_NAME);
//     });


//     test.skip("testUpdate", async () => {
//         this.registerScriptUpdate(this.UPDATE_NAME);
//     	this.callScriptUpdate(this.UPDATE_NAME);
//     });


//     test.skip("testDelete", async () => {
//         this.registerScriptDelete(this.DELETE_NAME);
//  		this.callScriptDelete(this.DELETE_NAME);
//     });


//     test.skip("testUploadFile", async () => {
//         // registerScriptFileUpload(UPLOAD_FILE_NAME);
//         // let transactionId = callScriptFileUpload(UPLOAD_FILE_NAME, fileName);
//         // uploadFileByTransActionId(transactionId);
//         // FilesServiceTest.verifyRemoteFileExists(filesService, fileName);
//     });


//     test.skip("testFileDownload", async () => {
//         // FilesServiceTest.removeLocalFile(localDstFilePath);
//         // registerScriptFileDownload(DOWNLOAD_FILE_NAME);
//         // String transactionId = callScriptFileDownload(DOWNLOAD_FILE_NAME, fileName);
//         // downloadFileByTransActionId(transactionId);
//         // Assertions.assertTrue(FilesServiceTest.isFileContentEqual(localSrcFilePath, localDstFilePath));
//     });

//     test.skip("testFileProperties", async () => {
//         registerScriptFileProperties(this.FILE_PROPERTIES_NAME);
//         callScriptFileProperties(this.FILE_PROPERTIES_NAME, fileName);
//     });

//     test.skip("testFileHash", async () => {
//         registerScriptFileHash(this.FILE_HASH_NAME);
//         callScriptFileHash(this.FILE_HASH_NAME, fileName);
//     });


//     test.skip("testUnregister", async () => {
//         expect(await this.scriptingService.unregisterScript(this.FILE_HASH_NAME)).not.toThrow();
//  		this.remove_test_database();
//     });
// }});