import {
	AlreadyExistsException,
	File,
	FilesService,
	NotFoundException,
	VaultSubscriptionService
} from "@elastosfoundation/hive-js-sdk";
import { TestData } from "../config/testdata";

describe("test file service", () => {

	const FILE_NAME_TXT = "test.txt";
	const FILE_CONTENT_TXT = "This is a test file";
	const FILE_NAME_BACKUP = "testbackup.txt";
	const FILE_NAME_BIN = "test.dat";
	const FILE_CONTENT_BIN = "This is a binary test file";
	const FILE_NAME_NOT_EXISTS = "not_exists";
	const REMOTE_DIR = "hive/";
	const INVALID_REMOTE_DIR = "badremotedir/";

	let filesService: FilesService;
	let testData: TestData;

	beforeAll(async () => {
		testData = await TestData.getInstance("filesservice.test");
		filesService = testData.newVault().getFilesService();
		prepareTestFile();
		try {
			const vaultSubscriptionService = new VaultSubscriptionService(
				testData.getAppContext(),
				testData.getProviderAddress());
			await vaultSubscriptionService.subscribe();
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
		let testFile = new File("testfile.txt");
		testFile.delete();
		let binTestFile = new File("testfile.txt");
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
		expect(expectedException).toBeInstanceOf(NotFoundException);
	}

	test("testUploadText", async () => {
		let testFile = new File(FILE_NAME_TXT);
		await filesService.upload(REMOTE_DIR + FILE_NAME_TXT, testFile.read());
		await verifyRemoteFileExists(REMOTE_DIR + FILE_NAME_TXT);
    });

	test("testUploadBin", async () => {
		let binTestFile = new File(FILE_NAME_BIN);
		await filesService.upload(REMOTE_DIR + FILE_NAME_BIN, binTestFile.read());
		await verifyRemoteFileExists(REMOTE_DIR + FILE_NAME_BIN);
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
		let expectedException;
		try {
			await filesService.download(FILE_NAME_NOT_EXISTS);
		} catch(e) {
			expectedException = e;
		}
		expect(expectedException).toBeInstanceOf(NotFoundException);
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
		expect(expectedException).toBeInstanceOf(NotFoundException);
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
		expect(expectedException).toBeInstanceOf(NotFoundException);
	});

	test("testMove", async () => {
		await filesService.delete(REMOTE_DIR + FILE_NAME_BACKUP);
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
		expect(expectedException).toBeInstanceOf(NotFoundException);
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
		expect(expectedException).toBeInstanceOf(NotFoundException);
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