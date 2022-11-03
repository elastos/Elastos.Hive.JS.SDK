import {
    AlreadyExistsException,
    FilesService,
    VaultSubscription
} from "../../../src";
import { TestData } from "../config/testdata";
import {Cipher} from "@elastosfoundation/did-js-sdk";
import {EncryptionFile} from "../../../src/service/files/encryptionfile";
import {File} from "../../../src/utils/storage/file";
import {randomBytes} from "crypto";

describe("test files service", () => {
    const FILE_NAME_TXT = "test_encryption.txt";
    const FILE_CONTENT_TXT = "This is a test file for encryption";
    const FILE_NAME_BIN = "test_encryption.dat";
    const FILE_CONTENT_BIN = "This is a binary test file for encryption";
    const REMOTE_DIR = "hive/";

    let filesService: FilesService;
    let cipher: Cipher;

    beforeAll(async () => {
        const testData = await TestData.getInstance("filesservice.test");
        filesService = await testData.getEncryptionFileService();
        cipher = await testData.getEncryptionCipher();
        prepareTestFile();

        // try to subscribe the vault if not exists.
        try {
            const vaultSubscription = new VaultSubscription(
                testData.getUserAppContext(),
                testData.getProviderAddress());
            await vaultSubscription.subscribe();
        } catch (e) {
            if (!(e instanceof AlreadyExistsException)) {
                throw e;
            }
        }
    });

    afterAll(() => {
        cleanTestFile();
    });

    function prepareTestFile(): void {
        let testFile = new File(FILE_NAME_TXT);
        testFile.createFile(true);
        testFile.write(Buffer.from(FILE_CONTENT_TXT));

        let binTestFile = new File(FILE_NAME_BIN);
        binTestFile.createFile(true);
        binTestFile.write(Buffer.from(FILE_CONTENT_BIN));
    }

    function cleanTestFile(): void {
        let testFile = new File(FILE_NAME_TXT);
        testFile.delete();
        let binTestFile = new File(FILE_NAME_BIN);
        binTestFile.delete();
    }

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

    async function verifyRemoteFileExists(path: string) {
        expect(await filesService.stat(path)).not.toBeNull();
    }

    test("testUploadText", async () => {
        let testFile = new File(FILE_NAME_TXT);
        await filesService.upload(REMOTE_DIR + FILE_NAME_TXT, testFile.read());
        await verifyRemoteFileExists(REMOTE_DIR + FILE_NAME_TXT);
    });

    test("testDownloadText", async () => {
        let dataBuffer = await filesService.download(REMOTE_DIR + FILE_NAME_TXT);
        expectBuffersToBeEqual(Buffer.from(FILE_CONTENT_TXT), dataBuffer);
    });

    /**
     * Used to check the time-consuming of the encryption of different file size.
     */
    test.skip('testFileEncryptDecrypt', () => {
        const content: Buffer = randomBytes(1 * 1024 * 1024);
        console.log(`start: ${Date.now()}`);
        const cipherData = new EncryptionFile(cipher, content).encrypt();
        console.log(`encrypt over: ${Date.now()}`);
        const clearData = new EncryptionFile(cipher, cipherData).decrypt();
        console.log(`decrypt over: ${Date.now()}`);
    });
});
