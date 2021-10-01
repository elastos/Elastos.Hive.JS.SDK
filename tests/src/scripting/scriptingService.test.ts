import { DatabaseService, ScriptingService } from "../../../typings";
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";
import { FileHashExecutable } from "../../../src/restclient//scripting/hashExecutable";
import { DeleteExecutable } from "../../../src/restclient//scripting/deleteExecutable";
import { InsertExecutable } from "../../../src/restclient//scripting/insertExecutable";
import { FindExecutable } from "../../../src/restclient//scripting/findExecutable";
import { UpdateExecutable } from "../../../src/restclient//scripting/updateExecutable";
import { QueryHasResultCondition } from "../../../src/restclient//scripting/queryHasResultCondition";





describe("test scripting service", () => {
    
    let testData: TestData;
    //let subscriptionService: VaultSubscriptionService;
    const PRICING_PLAN_NAME: String = "Rookie";
    //private static log = LoggerFactory.getLogger(ScriptingServiceTest.class);
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
    
    let targetDid: string;
    let appDid: string;
    
    let filesService: string;
    let databaseService: DatabaseService;
    let scriptingService: ScriptingService;
    //let scriptRunner:  ScriptRunner;
    
    let localSrcFilePath: string;
    let localDstFileRoot: string;
    let localDstFilePath: string;
    let fileName: string;

    
    function create_test_database() {
        try {
            databaseService.createCollection(COLLECTION_NAME).get();
        } catch (e) {
            //log.error("Failed to create collection: {}", e.getMessage());
        }
    }

    	/**
	 * If not exists, also return OK(_status).
	 */
	function remove_test_database() {
		try {
			databaseService.deleteCollection(COLLECTION_NAME).get();
		} catch (e) {
			//log.error("Failed to remove collection: {}", e.getMessage());
		}
    }
    
    function registerScriptDelete( scriptName: string) {
        let filter = { "author": "$params.author" };
        expect(scriptingService.registerScript(scriptName, new DeleteExecutable(scriptName, COLLECTION_NAME, filter), false, false).get()).not.toThrow();
    }

    function registerScriptInsert(scriptName: string) {
        //Assertions.assertDoesNotThrow(() -> {
        let doc = {"author": "$params.author", "content": "$params.content"};
        let options = { "bypass_document_validation": false, "ordered": true};
        scriptingService.registerScript(scriptName,
                new InsertExecutable(scriptName, COLLECTION_NAME, doc, options),
                false, false).get();
    }

    function callScriptInsert( scriptName: string) {
       
        let params = {"author":"John", "content": "message"}
        let result = scriptingService.callScript(scriptName, params, targetDid, appDid).get();
        expect(result).not.toBeNull();
        expect(result.has(scriptName)).toBeTruthy();
        expect(result.get(scriptName).has("inserted_id")).toBeTruthy();
    }

    function registerScriptFindWithoutCondition(scriptName: string) {
		
        let filter = {"author":"John"};
        scriptingService.registerScript(scriptName,
                 new FindExecutable(scriptName, COLLECTION_NAME, filter, null).setOutput(true),
                 false, false).get();
	
	}

    function callScriptFindWithoutCondition( scriptName: string) {
		//Assertions.assertDoesNotThrow(()->Assertions.assertNotNull(
		expect(scriptingService.callScriptUrl(scriptName, "{}", targetDid, appDid).get()).not.toBeNull();
    }
    
    function registerScriptFind( scriptName: string) {
        //Assertions.assertDoesNotThrow(()->{
        let filter = { "author":"John" };
        scriptingService.registerScript(scriptName,
                new QueryHasResultCondition("verify_user_permission", COLLECTION_NAME, filter, null),
                new FindExecutable(scriptName, COLLECTION_NAME, filter, null).setOutput(true),
                false, false).get();
       
	}

	function callScriptFind(scriptName: string) {
		// Assertions.assertDoesNotThrow(()->{
		// 	Assertions.assertNotNull(
		expect(this.scriptingService.callScript(scriptName, null, this.targetDid, this.appDid).get()).not.toBeNull();
		// });
	}

    function registerScriptUpdate( scriptName: string) {
 			let filter = {"author": "$params.author"};
 			let set = {"author": "$params.author", "content": "$params.content" };
 			let update = {"$set": set};
            let options = { "bypass_document_validation": false, "upsert": true};
 			expect(scriptingService.registerScript(scriptName,
 					new UpdateExecutable(scriptName, COLLECTION_NAME, filter, update, options),
                     false, false).get()).not.toThrow();
    }

    function callScriptUpdate( scriptName: string) {
        let params = {"author": "John", "content": "message" };
     	let result = scriptingService.callScript(scriptName, params, targetDid, appDid).get();
 		expect(result).not.toBeNull();
        expect(result.has(scriptName)).toBeTruthy();
        expect(result.get(scriptName).has("upserted_id")).toBeTruthy();
 	}

	function callScriptDelete( scriptName: string) {
		let params =  {"author": "John"};
		let result = scriptingService.callScript(scriptName, params, targetDid, appDid).get();
		expect(result).not.toBeNull();
		expect(result.has(scriptName)).toBeTruthy();
		expect(result.get(scriptName).has("deleted_count")).toBeTruthy();
    }
    
    function registerScriptFileUpload(scriptName: string) {
		//Assertions.assertDoesNotThrow(() ->
        // scriptingService.registerScript(scriptName,
        //         new FileUploadExecutable(scriptName).setOutput(true),
        //         false, false).get());
    }
    
    function callScriptFileUpload(scriptName: string, fileName: string) {
// 		try {
// 			JsonNode result = scriptRunner.callScript(scriptName,
// 					Executable.createRunFileParams(fileName),
// 					targetDid, appDid, JsonNode.class).get();
// 			Assertions.assertNotNull(result);
// 			Assertions.assertTrue(result.has(scriptName));
// 			Assertions.assertTrue(result.get(scriptName).has("transaction_id"));
// 			return result.get(scriptName).get("transaction_id").textValue();
// 		} catch (Exception e) {
// 			Assertions.fail(Throwables.getStackTraceAsString(e));
// 			return null;
// 		}
// 	}

	function uploadFileByTransActionId( transactionId: string) {
		// try (Writer writer = scriptRunner.uploadFile(transactionId, Writer.class).get();
		// 	 FileReader fileReader = new FileReader(localSrcFilePath)) {
		// 	Assertions.assertNotNull(writer);
		// 	char[] buffer = new char[1];
		// 	while (fileReader.read(buffer) != -1) {
		// 		writer.write(buffer);
		// 	}
		// } catch (Exception e) {
		// 	Assertions.fail(Throwables.getStackTraceAsString(e));
		// }
    }
    
    function registerScriptFileProperties( scriptName: string) {
		//Assertions.assertDoesNotThrow(() ->
        // scriptingService.registerScript(scriptName,
        //         new FilePropertiesExecutable(scriptName).setOutput(true),
        //         false, false).get());
	}

    function callScriptFileProperties(scriptName: string, fileName: string) {
// 		Assertions.assertDoesNotThrow(()->{
// 			JsonNode result = scriptRunner.callScript(scriptName,
// 					Executable.createRunFileParams(fileName),
// 					targetDid, appDid, JsonNode.class).get();
// 			Assertions.assertNotNull(result);
// 			Assertions.assertTrue(result.has(scriptName));
// 			Assertions.assertTrue(result.get(scriptName).has("size"));
// 			Assertions.assertTrue(result.get(scriptName).get("size").asInt(0) > 0);
// 		});
    }

    function registerScriptFileHash(scriptName: string) {
		expect(scriptingService.registerScript(scriptName,
						new FileHashExecutable(scriptName).setOutput(true),
				false, false).get()).not.toThrow();
    }

    function callScriptFileHash(scriptName: string, fileName: string) {
        // Assertions.assertDoesNotThrow(()->{
        //     JsonNode result = scriptRunner.callScript(scriptName,
        //             Executable.createRunFileParams(fileName),
        //             targetDid, appDid, JsonNode.class).get();
        //     Assertions.assertNotNull(result);
        //     Assertions.assertTrue(result.has(scriptName));
        //     Assertions.assertTrue(result.get(scriptName).has("SHA256"));
        //     Assertions.assertNotEquals(result.get(scriptName).get("SHA256").asText(""), "");
        // });
    }

	function registerScriptFileDownload( scriptName: string) {
		// expect(scriptingService.registerScript(scriptName,
		// 				new FileDownloadExecutable(scriptName).setOutput(true),
		// 				false, false).get()).not.toThrow();
	}

    beforeAll(async () => {
        let testData = await TestData.getInstance(ClientConfig.DEV, "/home/diego/temp");
        scriptingService = testData.newVault().getScriptingService();
        //scriptRunner = testData.newScriptRunner();
        filesService = testData.newVault().getFilesService();
        databaseService = testData.newVault().getDatabaseService();
        targetDid = testData.getUserDid();
        appDid = testData.getAppDid();
    });


    test.skip("testInsert", async () => {
        remove_test_database();
        create_test_database();
        registerScriptInsert(INSERT_NAME);
        callScriptInsert(INSERT_NAME);
    });

    test.skip("testFindWithoutCondition", async () => {
        registerScriptFindWithoutCondition(FIND_NO_CONDITION_NAME);
		callScriptFindWithoutCondition(FIND_NO_CONDITION_NAME);
    });

    test.skip("testFind", async () => {
        registerScriptFind(FIND_NAME);
        callScriptFind(FIND_NAME);
    });


    test.skip("testUpdate", async () => {
        registerScriptUpdate(UPDATE_NAME);
    	callScriptUpdate(UPDATE_NAME);
    });


    test.skip("testDelete", async () => {
        registerScriptDelete(DELETE_NAME);
 		callScriptDelete(DELETE_NAME);
    });


    test.skip("testUploadFile", async () => {
        // registerScriptFileUpload(UPLOAD_FILE_NAME);
        // let transactionId = callScriptFileUpload(UPLOAD_FILE_NAME, fileName);
        // uploadFileByTransActionId(transactionId);
        // FilesServiceTest.verifyRemoteFileExists(filesService, fileName);
    });


    test.skip("testFileDownload", async () => {
        // FilesServiceTest.removeLocalFile(localDstFilePath);
        // registerScriptFileDownload(DOWNLOAD_FILE_NAME);
        // String transactionId = callScriptFileDownload(DOWNLOAD_FILE_NAME, fileName);
        // downloadFileByTransActionId(transactionId);
        // Assertions.assertTrue(FilesServiceTest.isFileContentEqual(localSrcFilePath, localDstFilePath));
    });

    test.skip("testFileProperties", async () => {
        registerScriptFileProperties(FILE_PROPERTIES_NAME);
        callScriptFileProperties(FILE_PROPERTIES_NAME, fileName);
    });

    test.skip("testFileHash", async () => {
        registerScriptFileHash(FILE_HASH_NAME);
        callScriptFileHash(FILE_HASH_NAME, fileName);
    });


    test.skip("testUnregister", async () => {
        expect(scriptingService.unregisterScript(FILE_HASH_NAME).get()).not.toThrow();
 		remove_test_database();
    });
  
}});