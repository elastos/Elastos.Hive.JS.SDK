import {
    InvalidParameterException,
    VaultSubscription,
    DatabaseService,
    DeleteExecutable, InsertExecutable,
    FindExecutable,
    FileUploadExecutable,
    FileDownloadExecutable,
    FilePropertiesExecutable,
    FileHashExecutable,
    UpdateExecutable,
    ScriptingService, ScriptRunner,
    Vault,
    QueryHasResultCondition,
    Executable, NotFoundException, AlreadyExistsException
} from "@elastosfoundation/hive-js-sdk";
import { TestData } from "../config/testdata";

describe("test scripting runner function", () => {

    let testData: TestData;
    let vaultSubscription: VaultSubscription;
    let vault: Vault;

    const UPLOAD_FILE_NAME = "upload_file";
    const DOWNLOAD_FILE_NAME = "download_file";
    const DOWNLOAD_BY_HIVE_URL = "download_by_hive_url";
    const FILE_PROPERTIES_NAME = "file_properties";
    const FILE_HASH_NAME = "file_hash";

    const COLLECTION_NAME = "js_script_database";
    const FILE_CONTENT = "this is test file abcdefghijklmnopqrstuvwxyz";

    let targetDid: string;
    let appDid: string;

    let databaseService: DatabaseService;
    let scriptingService: ScriptingService;
    let scriptRunner: ScriptRunner;

    let localSrcFilePath: string;
    let localDstFileRoot: string;
    let localDstFilePath: string;
    let fileName: string = "test.txt";

    beforeAll(async () => {
        testData = await TestData.getInstance("scriptingservice.test");
        vaultSubscription = new VaultSubscription(testData.getUserAppContext(), testData.getProviderAddress());
        vault = new Vault(testData.getUserAppContext(), testData.getProviderAddress());

        scriptRunner = new ScriptRunner(testData.getCallerAppContext(), testData.getProviderAddress());

        try {
            await vaultSubscription.subscribe();
        } catch (e){
            console.log("vault is already subscribed");
        }

        scriptingService = vault.getScriptingService();
        databaseService = vault.getDatabaseService();
        targetDid = testData.getUserDid();
        appDid = testData.getAppDid();

        try {
            await databaseService.createCollection(COLLECTION_NAME);
        } catch (e) {
            if (e instanceof AlreadyExistsException) {
                // ok, skip this.
            } else {
                console.error(`Failed to create collection: ${e}`);
            }
        }
    });

    afterAll(async () => {
        try {
            await databaseService.deleteCollection(COLLECTION_NAME);
        } catch (e) {
            if (e instanceof NotFoundException) {
                // ok, skip this.
            } else {
                console.error(`Failed to remove collection: ${e}`);
            }
        }
        try {
            await vaultSubscription.unsubscribe();
        } catch (e) {
            console.log("vault is already subscribed");
        }
    });

    test("testInsert", async () => {
        const scriptName = "database_insert";
        const doc = { "author": "$params.author", "content": "$params.content", "words_count": "$params.count" };
        const options = { "bypass_document_validation": false, "ordered": true };

        await scriptingService.registerScript(scriptName,
            new InsertExecutable(scriptName, COLLECTION_NAME, doc, options));

        const call_insert = async (content, count, author?: string) => {
            const params = { "author": author == undefined ? "John" : author, "content": content, "count": count }
            const result: InsertResponse =
                await scriptRunner.callScript<InsertResponse>(scriptName, params, targetDid, appDid);

            expect(result).not.toBeNull();
            expect(result.database_insert).not.toBeNull();
            expect(result.database_insert.inserted_id).not.toBeNull();
        };

        // for find, update
        await call_insert('message1', 10000);
        await call_insert('message2', 20000);
        await call_insert('message3', 30000);
        await call_insert('message4', 40000);

        // for delete
        await call_insert('message1', 10000, 'Danie');
        await call_insert('message2', 20000, 'Danie');

        await scriptingService.unregisterScript(scriptName);
    });

    test("testFindWithoutCondition", async () => {
        const scriptName = "database_find";
        const filter = { "author": "$params.author" };
        await scriptingService.registerScript(scriptName,
            new FindExecutable(scriptName, COLLECTION_NAME, filter, null));

        const result: FindResponse =
            await scriptRunner.callScriptUrl<FindResponse>(scriptName, '{"author": "John"}', targetDid, appDid);

        expect(result).not.toBeNull();
        expect(result.database_find).not.toBeNull();
        expect(result.database_find.total).toEqual(4);
        expect(result.database_find.items).not.toBeNull();
        expect(result.database_find.items).toHaveLength(4);

        await scriptingService.unregisterScript(scriptName);
    });

    test("testFind", async () => {
        const scriptName = 'database_find';
        const filter = { "author": "$params.author" };

        await scriptingService.registerScript(scriptName,
            new FindExecutable(scriptName, COLLECTION_NAME, filter, null),
            new QueryHasResultCondition("verify_user_permission", COLLECTION_NAME, filter, null));

        const result: FindResponse =
            await scriptRunner.callScript<FindResponse>(scriptName, {"author": "John"}, targetDid, appDid);

        expect(result).not.toBeNull();
        expect(result.database_find).not.toBeNull();
        expect(result.database_find.total).toEqual(4);
        expect(result.database_find.items).not.toBeNull();
        expect(result.database_find.items).toHaveLength(4);

        await scriptingService.unregisterScript(scriptName);
    });

    test("testUpdate", async () => {
        const scriptName = 'database_update';
        const filter = { "author": "John", "content": "$params.content" };
        const update = { "$set": { "words_count": "$params.count" } };
        const options = { "bypass_document_validation": false, "upsert": false };

        await scriptingService.registerScript(scriptName,
                new UpdateExecutable(scriptName, COLLECTION_NAME, filter, update, options));

        const call_update = async (count) => {
            const params = { "content": "message1", "count": count };
            const result: UpdateResponse =
                await scriptRunner.callScript<UpdateResponse>(scriptName, params, targetDid, appDid);

            expect(result).not.toBeNull();
            expect(result.database_update).not.toBeNull();
            expect(result.database_update.matched_count).toEqual(1);
            expect(result.database_update.modified_count).toEqual(1);
        };

        await call_update(15000);
        await call_update(10000);

        await scriptingService.unregisterScript(scriptName);
    });

    test("testDelete", async () => {
        const scriptName = 'database_delete';
        const filter = { "author": "$params.author" };

        await scriptingService.registerScript(scriptName,
            new DeleteExecutable(scriptName, COLLECTION_NAME, filter));

        let result: DeleteResponse =
            await scriptRunner.callScript<DeleteResponse>(scriptName, { "author": "Danie" }, targetDid, appDid);

        expect(result).not.toBeNull();
        expect(result.database_delete).not.toBeNull();
        expect(result.database_delete.deleted_count).toEqual(1);

        await scriptingService.unregisterScript(scriptName);
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

    test("testDownloadAndUploadWithString", async () => {
        await registerScriptFileUpload(UPLOAD_FILE_NAME);
        let uploadTransactionId = await callScriptFileUpload(UPLOAD_FILE_NAME, "testDownloadUpload.txt");
        await uploadFileByTransActionId(uploadTransactionId, FILE_CONTENT);

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

    interface InsertResponse {
        database_insert: { acknowledged: boolean, inserted_id: string};
    }

    interface FindResponse {
        database_find: { total: number, items: []};
    }

    interface UpdateResponse {
        database_update: {
            acknowledged: boolean,
            matched_count: number,
            modified_count: number,
            upserted_id: string
        };
    }

    interface DeleteResponse {
        database_delete: { acknowledged: boolean, deleted_count: number};
    }

    /**
     * except buffers are equal.
     * @param expected
     * @param actual
     */
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
