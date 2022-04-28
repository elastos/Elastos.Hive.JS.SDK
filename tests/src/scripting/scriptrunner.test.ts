import {
    InvalidParameterException,
    VaultSubscriptionService,
    DatabaseService,
    DeleteExecutable, InsertExecutable,
    FindExecutable,
    FileUploadExecutable,
    FileDownloadExecutable,
    FilePropertiesExecutable,
    FileHashExecutable,
    UpdateExecutable,
    ScriptingService, ScriptRunner,
    VaultServices,
    QueryHasResultCondition,
    FilesService,
    Executable, NotFoundException
} from "@elastosfoundation/hive-js-sdk";
import { TestData } from "../config/testdata";

describe("test scripting runner function", () => {

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
    const DOWNLOAD_BY_HIVE_URL = "download_by_hive_url";
    const FILE_PROPERTIES_NAME = "file_properties";
    const FILE_HASH_NAME = "file_hash";

    const COLLECTION_NAME = "script_database";
    const FILE_CONTENT = "this is test file abcdefghijklmnopqrstuvwxyz";

    let targetDid: string;
    let appDid: string;

    let filesService: FilesService;
    let databaseService: DatabaseService;
    let scriptingService: ScriptingService;
    let scriptRunner: ScriptRunner;

    let localSrcFilePath: string;
    let localDstFileRoot: string;
    let localDstFilePath: string;
    let fileName: string = "test.txt";

    beforeAll(async () => {
        testData = await TestData.getInstance("scriptingservice.test");
        vaultSubscriptionService = new VaultSubscriptionService(testData.getAppContext(), testData.getProviderAddress());
        vaultServices = new VaultServices(testData.getAppContext(), testData.getProviderAddress());
        scriptRunner = new ScriptRunner(testData.getAppContext(), testData.getProviderAddress());

        try {
            await vaultSubscriptionService.subscribe();
        } catch (e){
            console.log("vault is already subscribed");
        }

        scriptingService = vaultServices.getScriptingService();
        filesService = vaultServices.getFilesService();
        databaseService = vaultServices.getDatabaseService();
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

    test("testDownloadFileByHiveUrl", async () => {
        const fileName = "testDownloadUploadByHiveUrl.txt";
        await registerScriptFileUpload(UPLOAD_FILE_NAME);
        let uploadTransactionId = await callScriptFileUpload(UPLOAD_FILE_NAME, fileName);
        await uploadFileByTransActionId(uploadTransactionId, Buffer.from(FILE_CONTENT));

        await registerScriptFileDownload(DOWNLOAD_BY_HIVE_URL, false, 'fake_executable_name');
        const hiveUrl = `hive://${targetDid}@${appDid}/${DOWNLOAD_BY_HIVE_URL}?params={"path": "${fileName}"}`;
        const buffer = await scriptRunner.downloadFileByHiveUrl(hiveUrl);
        expectBuffersToBeEqual(Buffer.from(FILE_CONTENT), buffer);
    });

    test("testDownloadAndUploadAnonymous", async () => {
        await registerScriptFileUpload(UPLOAD_FILE_NAME);
        let uploadTransactionId = await callScriptFileUpload(UPLOAD_FILE_NAME, "testDownloadUploadAnonymous.txt");
        await uploadFileByTransActionId(uploadTransactionId, Buffer.from(FILE_CONTENT));
        await registerScriptFileDownload(DOWNLOAD_FILE_NAME, true);
        let downloadTransactionId = await callScriptFileDownload(DOWNLOAD_FILE_NAME, "testDownloadUploadAnonymous.txt");
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
            if (e instanceof NotFoundException) {
                // ok, skip this.
            } else {
                console.error(`Failed to remove collection: ${e}`);
            }
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
        let result : DatabaseInsertResponse = await scriptRunner.callScript<DatabaseInsertResponse>(scriptName, params, targetDid, appDid);

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
        await expect(scriptRunner.callScriptUrl<any>(scriptName, "{}", targetDid, appDid)).resolves.not.toBeNull();
    }

    async function registerScriptFind( scriptName: string) {
        let filter = { "author":"John" };
        await scriptingService.registerScript(scriptName,
            new FindExecutable(scriptName, COLLECTION_NAME, filter, null),
            new QueryHasResultCondition("verify_user_permission", COLLECTION_NAME, filter, null));
    }

    async function callScriptFind(scriptName: string) {
        await expect(scriptRunner.callScript<any>(scriptName, {}, targetDid, appDid)).resolves.not.toBeNull();
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
        let result = await scriptRunner.callScript(scriptName, params, targetDid, appDid);

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
        let result: DatabaseDeleteResponse = await scriptRunner.callScript<DatabaseDeleteResponse>(scriptName, params, targetDid, appDid);

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
        let result = await scriptRunner.callScript<any>(scriptName,
            Executable.createRunFileParams(fileName),
            targetDid, appDid);
        expect(result).not.toBeNull();
        expect(result[scriptName]).not.toBeNull();

        console.log(JSON.stringify(result[scriptName]));
        expect(result[scriptName].transaction_id).not.toBeNull();
        return result[scriptName].transaction_id;
    }

    async function uploadFileByTransActionId( transactionId: string, content: any): Promise<void> {
        await scriptRunner.uploadFile(transactionId, content);
    }

    async function registerScriptFileProperties( scriptName: string) {
        await scriptingService.registerScript(scriptName,
            new FilePropertiesExecutable(scriptName).setOutput(true),
            undefined,
            false, false);
    }

    async function callScriptFileProperties(scriptName: string, fileName: string): Promise<void> {
        let result = await scriptRunner.callScript<any>(scriptName,
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
        let result = await scriptRunner.callScript(scriptName,
            Executable.createRunFileParams(fileName),
            targetDid, appDid);
        expect(result).not.toBeNull();
        expect(result[scriptName]).not.toBeNull();
        expect(result[scriptName].SHA256).not.toBeNull();
        expect(result[scriptName].SHA256.length).toBeGreaterThan(0);
    }

    async function registerScriptFileDownload(scriptName: string, anonymous?: boolean, executableName?: string) {
        const name = executableName ? executableName : scriptName;
        await scriptingService.registerScript(scriptName,
            new FileDownloadExecutable(name).setOutput(true),
            undefined,
            anonymous ?? false, anonymous ?? false);
    }

    async function callScriptFileDownload(scriptName: string, fileName: string): Promise<string> {
        let result = await scriptRunner.callScript(scriptName,
            Executable.createRunFileParams(fileName),
            targetDid, appDid);
        expect(result).not.toBeNull();
        expect(result[scriptName]).not.toBeNull();
        expect(result[scriptName].transaction_id).not.toBeNull();
        if ('anonymous_url' in result[scriptName]) {
            expect(result[scriptName].anonymous_url).not.toBeNull();
            console.log(`anonymous_url: ${result[scriptName].anonymous_url}`);
        }
        return result[scriptName].transaction_id;
    }
    async function downloadFileByTransActionId(transactionId: string): Promise<Buffer> {
        return await scriptRunner.downloadFile(transactionId);
    }
});
