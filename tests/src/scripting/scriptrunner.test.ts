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
    Executable, NotFoundException, AlreadyExistsException, CountExecutable
} from "../../../src";
import { TestData } from "../config/testdata";

describe("test scripting runner function", () => {

    let testData: TestData;
    let vaultSubscription: VaultSubscription;
    let vault: Vault;

    const COLLECTION_NAME = "js_script_database";
    const FILE_NAME = "js_script_file.txt";
    const FILE_CONTENT = 'File Content: 1234567890';
    const FILE_HASH = '161d165c6b49616cc82846814ccb2bbaa0928b8570bac7f6ba642c65d6006cfe';

    let targetDid: string;
    let appDid: string;

    let databaseService: DatabaseService;
    let scriptingService: ScriptingService;
    let scriptRunner: ScriptRunner;
    let anonymousRunner: ScriptRunner;

    beforeAll(async () => {
        testData = await TestData.getInstance("scriptingservice.test");
        vaultSubscription = new VaultSubscription(testData.getUserAppContext(), testData.getProviderAddress());
        vault = new Vault(testData.getUserAppContext(), testData.getProviderAddress());

        scriptRunner = new ScriptRunner(testData.getCallerAppContext(), testData.getProviderAddress());
        anonymousRunner = new ScriptRunner(null, testData.getProviderAddress());

        try {
            await vaultSubscription.subscribe();
        } catch (e){
            // console.log("vault is already subscribed");
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
        try { // remove vault to remove file
            await vaultSubscription.unsubscribe();
        } catch (e) {
            // console.log("vault is already subscribed");
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

    test("testCount", async () => {
        const scriptName = 'script_database_count';
        const executableName = 'database_count';
        const filter = { "author": "$params.author" };

        await scriptingService.registerScript(scriptName,
            new CountExecutable(executableName, COLLECTION_NAME, filter, null),
            new QueryHasResultCondition("verify_user_permission", COLLECTION_NAME, filter, null));

        const result: CountResponse =
            await scriptRunner.callScript<CountResponse>(scriptName, {"author": "John"}, targetDid, appDid);

        expect(result).not.toBeNull();
        expect(result.database_count).not.toBeNull();
        expect(result.database_count.count).toEqual(4);

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

    test("testUpload", async () => {
        await uploadFile();
        await uploadFile(true, true);
    });

    test("testUploadAndDownload", async () => {
        await uploadFile();
        await downloadFile();
        await downloadFile(true);
    });

    test.skip("testDownloadFileByHiveUrl", async () => {
        await uploadFile();
        await downloadFileByHiveUrl();
        await downloadFileByHiveUrl(true);
    });

    test("testDownloadFileByHiveUrl on mainnet", async () => {
        // INFO: only for EE to get the avatar image from user did related vault.
        let hiveUrl = null;
        if (testData.isTestnet()) {
            // avatar is on hive2 testnet node.
            hiveUrl = 'hive://did:elastos:iWVsBA12QrDcp4UBjuys1tykHD2u6XWVYq@did:elastos:ig1nqyyJhwTctdLyDFbZomSbZSjyMN1uor/getMainIdentityAvatar1658145105312?params={"empty":0}'
        } else {
            // avatar is on hive2 mainnet node.
            hiveUrl = 'hive://did:elastos:iabbGwqUN18F6YxkndmZCiHpRPFsQF1imT@did:elastos:ig1nqyyJhwTctdLyDFbZomSbZSjyMN1uor/getMainIdentityAvatar1627717470347?params={"empty":0}';
        }
        const buffer = await scriptRunner.downloadFileByHiveUrl(hiveUrl);
        expect(buffer).not.toBeNull();
    });

    test.skip("testDownloadWithInvalidTransactionId", async () => {
        const invalidTransactionId = "0000000";
        async function downloadFileWithInvalidTransId(anonymous=false) {
            try {
                await getScriptRunner(anonymous).downloadFile(invalidTransactionId);
            } catch (e) {
                // expect(typeof e).toBe('InvalidParameterException');
            }
        }

        await downloadFileWithInvalidTransId();
        await downloadFileWithInvalidTransId(true);
    });

    test("testFileProperties", async () => {
        await uploadFile();
        await fileProperties();
        await fileProperties(true);
    });

    test("testFileHash", async () => {
        await uploadFile();
        await fileHash();
        await fileHash(true);
    });

    interface InsertResponse {
        database_insert: { acknowledged: boolean, inserted_id: string};
    }

    interface FindResponse {
        database_find: { total: number, items: []};
    }

    interface CountResponse {
        database_count: { count: number};
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

    interface UploadResponse {
        file_upload: { transaction_id: string };
    }

    interface DownloadResponse {
        file_download: { transaction_id: string };
    }

    interface PropertiesResponse {
        file_properties: { type: string, name: string, size: number, last_modify: number };
    }

    interface HashResponse {
        file_hash: { SHA256: string };
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

    function getScriptRunner(anonymous=false) {
        return anonymous ? anonymousRunner : scriptRunner;
    }

    async function uploadFile(anonymous=false, bufferContent=false) {
        const [scriptName, executableName] = ['script_file_upload', 'file_upload'];

        // register upload script
        await scriptingService.registerScript(scriptName,
            new FileUploadExecutable(executableName), null, anonymous, anonymous);

        // call upload script
        const result: UploadResponse = await getScriptRunner(anonymous).callScript<UploadResponse>(scriptName,
            Executable.createRunFileParams(FILE_NAME), targetDid, appDid);
        expect(result).not.toBeNull();
        expect(result.file_upload).not.toBeNull();
        expect(result.file_upload.transaction_id).not.toBeNull();

        // upload file
        const content = bufferContent ? Buffer.from(FILE_CONTENT) : FILE_CONTENT;
        await getScriptRunner(anonymous).uploadFile(result.file_upload.transaction_id, content);

        await scriptingService.unregisterScript(scriptName);
    }

    async function downloadFile(anonymous=false) {
        const [scriptName, executableName] = ['script_file_download', 'file_download'];

        // register download script
        await scriptingService.registerScript(scriptName,
            new FileDownloadExecutable(executableName), null, anonymous, anonymous);

        // call download script
        const result: DownloadResponse = await getScriptRunner(anonymous).callScript<DownloadResponse>(scriptName,
            Executable.createRunFileParams(FILE_NAME), targetDid, appDid);
        expect(result).not.toBeNull();
        expect(result.file_download).not.toBeNull();
        expect(result.file_download.transaction_id).not.toBeNull();

        // download file
        const buffer = await getScriptRunner(anonymous).downloadFile(result.file_download.transaction_id);
        expectBuffersToBeEqual(Buffer.from(FILE_CONTENT), buffer);

        await scriptingService.unregisterScript(scriptName);
    }

    async function downloadFileByHiveUrl(anonymous=false) {
        const [scriptName, executableName] = ['script_file_download_by_hiveurl', 'file_download'];

        // register download script
        await scriptingService.registerScript(scriptName,
            new FileDownloadExecutable(executableName), null, anonymous, anonymous);

        const hiveUrl = `hive://${targetDid}@${appDid}/${scriptName}?params={"path":"${FILE_NAME}"}`;
        const buffer = await getScriptRunner(anonymous).downloadFileByHiveUrl(hiveUrl);
        expectBuffersToBeEqual(Buffer.from(FILE_CONTENT), buffer);

        await scriptingService.unregisterScript(scriptName);
    }

    async function fileProperties(anonymous=false) {
        const [scriptName, executableName] = ['script_file_properties', 'file_properties'];

        // register script
        await scriptingService.registerScript(scriptName,
            new FilePropertiesExecutable(executableName), null, anonymous, anonymous);

        // call script
        const result: PropertiesResponse = await getScriptRunner(anonymous).callScript<PropertiesResponse>(scriptName,
            Executable.createRunFileParams(FILE_NAME), targetDid, appDid);
        expect(result).not.toBeNull();
        expect(result.file_properties).not.toBeNull();
        expect(result.file_properties.type).toEqual('file');
        expect(result.file_properties.name).toEqual(FILE_NAME);
        expect(result.file_properties.size).toEqual(FILE_CONTENT.length);
        expect(result.file_properties.last_modify).toBeGreaterThan(0);

        await scriptingService.unregisterScript(scriptName);
    }

    async function fileHash(anonymous=false) {
        const [scriptName, executableName] = ['script_file_hash', 'file_hash'];

        // register script
        await scriptingService.registerScript(scriptName,
            new FileHashExecutable(executableName), null, anonymous, anonymous);

        // call script
        const result: HashResponse = await getScriptRunner(anonymous).callScript<HashResponse>(scriptName,
            Executable.createRunFileParams(FILE_NAME), targetDid, appDid);
        expect(result).not.toBeNull();
        expect(result.file_hash).not.toBeNull();
        expect(result.file_hash.SHA256).toEqual(FILE_HASH);

        await scriptingService.unregisterScript(scriptName);
    }
});
