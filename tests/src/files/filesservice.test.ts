import {
    AlreadyExistsException,
    FileNotFoundException,
    FilesService, IpfsRunner,
    AnonymousScriptRunner,
    VaultSubscription
} from "../../../src";
import {TestData} from "../config/testdata";
import {File} from "../../../src/utils/storage/file";
import {Blob} from 'buffer';

describe("test files service", () => {

	const FILE_NAME_TXT = "test.txt";
	const FILE_CONTENT_TXT = "This is a test file";
	const FILE_NAME_BACKUP = "testbackup.txt";
	const FILE_NAME_BIN = "test.dat";
	const FILE_CONTENT_BIN = "This is a binary test file";
	const FILE_NAME_NOT_EXISTS = "not_exists";
	const REMOTE_DIR = "hive/";
	const INVALID_REMOTE_DIR = "badremotedir/";

	const FILE_STR_NAME = "string.dat";
	const FILE_STR_CONTENT = "This is a string test file";

	const FILE_PUBLIC_NAME = "test_public.txt";
	const FILE_PUBLIC_CONTENT = "This is a public test file";

	let filesService: FilesService;
	let testData: TestData;

	let anonymousScriptRunner: AnonymousScriptRunner;
	let targetDid: string;
	let appDid: string;

	beforeAll(async () => {
		testData = await TestData.getInstance("filesservice.test");
		filesService = testData.newVault().getFilesService();
		prepareTestFile();
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

        anonymousScriptRunner = testData.newAnonymousCallerScriptRunner();
		targetDid = testData.getUserDid();
		appDid = testData.getAppDid();
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

	async function verifyRemoteFileNotExists(path: string) {
		let expectedException;
		try {
			await filesService.stat(path);
		} catch (e) {
			expectedException = e;
		}
		expect(expectedException).toBeInstanceOf(FileNotFoundException);
	}

	test("testUploadText", async () => {
		let testFile = new File(FILE_NAME_TXT);
		await filesService.upload(REMOTE_DIR + FILE_NAME_TXT, testFile.read());
		await verifyRemoteFileExists(REMOTE_DIR + FILE_NAME_TXT);
    });

	test.skip("testUploadTextPublic", async () => {
		const fileName = REMOTE_DIR + FILE_PUBLIC_NAME;
		const cid = await filesService.upload(fileName, Buffer.from(FILE_PUBLIC_CONTENT), null, true);
        expect(cid).toBeTruthy();

		// check by directly downloading.
		let data: Buffer = await filesService.download(fileName);
		expectBuffersToBeEqual(Buffer.from(FILE_PUBLIC_CONTENT), data);

		// check by scripting downloading.
        data = await anonymousScriptRunner.downloadAnonymousFile(targetDid, appDid, fileName);
		expectBuffersToBeEqual(Buffer.from(FILE_PUBLIC_CONTENT), data);

		// check by cid
		data = await new IpfsRunner(testData.getIpfsGatewayUrl()).getFile(cid);
		expectBuffersToBeEqual(Buffer.from(FILE_PUBLIC_CONTENT), data);
	});

	test("testUploadWithString", async () => {
		const filePath = REMOTE_DIR + FILE_STR_NAME
		await filesService.upload(filePath, FILE_STR_CONTENT);
		const data = await filesService.download(filePath);
		expectBuffersToBeEqual(Buffer.from(FILE_STR_CONTENT), data);
		await filesService.delete(filePath);
	});

	test("testUploadBin", async () => {
		let binTestFile = new File(FILE_NAME_BIN);
		await filesService.upload(REMOTE_DIR + FILE_NAME_BIN, binTestFile.read());
		await verifyRemoteFileExists(REMOTE_DIR + FILE_NAME_BIN);
    });

	test("testUploadBinBlob", async () => {
		const fileName = REMOTE_DIR + FILE_NAME_BIN + 'Blob';
		const obj = {hello: 'world'};
		const blob = new Blob([JSON.stringify(obj, null, 2)], {type : 'application/json'});
		const arrayBuffer2Buffer = (arrayBuffer: ArrayBuffer) => {
			const buffer = Buffer.alloc(arrayBuffer.byteLength);
			const view = new Uint8Array(arrayBuffer);
			for (let i = 0; i < buffer.length; ++i) {
				buffer[i] = view[i];
			}
			return buffer;
		};
		const blob2Buffer = async (b: Blob) => {
			return arrayBuffer2Buffer(await b.arrayBuffer());
		};
		await filesService.upload(fileName, await blob2Buffer(blob));
		await verifyRemoteFileExists(fileName);
		const dataBuffer = await filesService.download(fileName);
		expectBuffersToBeEqual(await blob2Buffer(blob), dataBuffer);
	});

	test("testDownloadText", async () => {
		let dataBuffer = await filesService.download(REMOTE_DIR + FILE_NAME_TXT);
		expectBuffersToBeEqual(Buffer.from(FILE_CONTENT_TXT), dataBuffer);
    });

	test("testDownloadBin", async () => {
		let dataBuffer = await filesService.download(REMOTE_DIR + FILE_NAME_BIN);
		expectBuffersToBeEqual(Buffer.from(FILE_CONTENT_BIN), dataBuffer);
    });

	test("testDownloadBin4NotFoundException", async () => {
		let expectedException = null;
        try {
			await filesService.download(FILE_NAME_NOT_EXISTS);
		} catch(e) {
			expectedException = e;
		}
        expect(expectedException).toBeInstanceOf(FileNotFoundException);
    });

	test("testList", async () => {
		let files = await filesService.list(REMOTE_DIR);
		expect(files).not.toBeNull();
		expect(files.length).toBeGreaterThanOrEqual(2);
		let hasOurTextFile = false;
		let hasOurBinFile = false;
		files.forEach((element) => {
			if (element.getName() === `${REMOTE_DIR}${FILE_NAME_TXT}`) {
				hasOurTextFile = true;
			} else if (element.getName() === `${REMOTE_DIR}${FILE_NAME_BIN}`) {
				hasOurBinFile = true;
			}
		});
		expect(hasOurTextFile).toBeTruthy();
		expect(hasOurBinFile).toBeTruthy();
 	});


	test("testList4NotFoundException", async () => {
		let expectedException;
		try {
			await filesService.list(INVALID_REMOTE_DIR);
		} catch (e) {
			expectedException = e;
		}
		expect(expectedException).toBeInstanceOf(FileNotFoundException);
	});

	test("testHash", async () => {
		await filesService.hash(REMOTE_DIR + FILE_NAME_TXT);
	});

	test("testHash4NotFoundException", async () => {
		let expectedException;
		try {
			await filesService.hash(INVALID_REMOTE_DIR + FILE_NAME_NOT_EXISTS);
		} catch (e) {
			expectedException = e;
		}
		expect(expectedException).toBeInstanceOf(FileNotFoundException);
	});

	test("testMove", async () => {
		await filesService.move(REMOTE_DIR + FILE_NAME_TXT, REMOTE_DIR + FILE_NAME_BACKUP);
		await verifyRemoteFileExists(REMOTE_DIR + FILE_NAME_BACKUP);
		await verifyRemoteFileNotExists(REMOTE_DIR + FILE_NAME_TXT);
	});

	test("testMove4NotFoundException", async () => {
		let expectedException;
		try {
			await filesService.move(INVALID_REMOTE_DIR + FILE_NAME_NOT_EXISTS, REMOTE_DIR + FILE_NAME_TXT);
		} catch (e) {
			expectedException = e;
		}
		expect(expectedException).toBeInstanceOf(FileNotFoundException);
	});

	test("testCopy", async () => {
		await filesService.delete(REMOTE_DIR + FILE_NAME_BACKUP);
		await filesService.copy(REMOTE_DIR + FILE_NAME_BIN, REMOTE_DIR + FILE_NAME_BACKUP);
		await verifyRemoteFileExists(REMOTE_DIR + FILE_NAME_BACKUP);
		await verifyRemoteFileExists(REMOTE_DIR + FILE_NAME_BIN);
	});

	test("testCopy4NotFoundException", async () => {
		let expectedException;
		try {
			await filesService.copy(INVALID_REMOTE_DIR + FILE_NAME_NOT_EXISTS, REMOTE_DIR + FILE_NAME_TXT);
		} catch (e) {
			expectedException = e;
		}
		expect(expectedException).toBeInstanceOf(FileNotFoundException);
	});

	test("testDeleteFile", async () => {
		await filesService.delete(REMOTE_DIR + FILE_NAME_BACKUP);
		let testFile = new File(FILE_NAME_TXT);
		await filesService.upload(REMOTE_DIR + FILE_NAME_BACKUP, testFile.read());
		await verifyRemoteFileExists(REMOTE_DIR + FILE_NAME_BACKUP);


		let expectedException = null;
		try {
			await filesService.delete(REMOTE_DIR + FILE_NAME_BACKUP);
		} catch (e) {
			expectedException = e;
		}
		expect(expectedException).toBeNull();
		await verifyRemoteFileNotExists(REMOTE_DIR + FILE_NAME_BACKUP);
	});
});