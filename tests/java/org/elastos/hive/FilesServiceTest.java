package org.elastos.hive;

import com.google.common.base.Throwables;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;

import org.elastos.hive.config.TestData;
import org.elastos.hive.service.FilesService;
import org.elastos.hive.vault.files.FileInfo;
import org.junit.jupiter.api.*;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class FilesServiceTest {
	private static final String FILE_NAME_TXT = "test.txt";
	private static final String FILE_NAME_IMG = "big.png";
	private static final String FILE_NAME_NOT_EXISTS = "not_exists";

	private final String localTxtFilePath;
	private final String localImgFilePath;
	private final String localCacheRootDir;

	private final String remoteRootDir;
	private final String remoteTxtFilePath;
	private final String remoteImgFilePath;
	private final String remoteNotExistsFilePath;
	private final String remoteBackupTxtFilePath;

	private static FilesService filesService;

	public FilesServiceTest() {
		String rootDir = System.getProperty("user.dir") + "/src/test/resources/local/";
		localTxtFilePath = rootDir + FILE_NAME_TXT;
		localImgFilePath = rootDir + FILE_NAME_IMG;
		localCacheRootDir = rootDir + "cache/file/";
		remoteRootDir = "hive";
		remoteTxtFilePath = remoteRootDir + "/" + FILE_NAME_TXT;
		remoteImgFilePath = remoteRootDir + "/" + FILE_NAME_IMG;
		remoteNotExistsFilePath = remoteRootDir + "/" + FILE_NAME_NOT_EXISTS;
		remoteBackupTxtFilePath = remoteRootDir + "/" + FILE_NAME_TXT + "2";
	}

	@BeforeAll public static void setUp() {

		Level level = Level.valueOf("WARN");
		Logger root = (Logger)LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
	    root.setLevel(level);

		Assertions.assertDoesNotThrow(()->{
			TestData testData = TestData.getInstance();
			new VaultSubscription(testData.getAppContext(),
					testData.getProviderAddress());
			filesService = testData.newVault().getFilesService();
		});
	}

	@Test @Order(1) void testUploadText() {
		Assertions.assertDoesNotThrow(this::uploadTextReally);
		verifyRemoteFileExists(remoteTxtFilePath);
	}

	private void uploadTextReally() throws IOException, ExecutionException, InterruptedException {
		try (Writer writer = filesService.getUploadWriter(remoteTxtFilePath).get();
			 FileReader fileReader = new FileReader(localTxtFilePath)) {
			Assertions.assertNotNull(writer);
			char[] buffer = new char[1];
			while (fileReader.read(buffer) != -1) {
				writer.write(buffer);
			}
		}
	}

	@Test @Order(2) void testUploadBin() {
		try (OutputStream out = filesService.getUploadStream(remoteImgFilePath).get()) {
			Assertions.assertNotNull(out);
			out.write(Utils.readImage(localImgFilePath));
			out.flush();
		} catch (Exception e) {
			Assertions.fail(Throwables.getStackTraceAsString(e));
		}
		verifyRemoteFileExists(remoteImgFilePath);
	}

	@Test @Order(3) void testDownloadText() {
		try (Reader reader = filesService.getDownloadReader(remoteTxtFilePath).get()) {
			Assertions.assertNotNull(reader);
			Utils.cacheTextFile(reader, localCacheRootDir, FILE_NAME_TXT);
			Assertions.assertTrue(isFileContentEqual(localTxtFilePath, localCacheRootDir + FILE_NAME_TXT));
		} catch (Exception e) {
			Assertions.fail(Throwables.getStackTraceAsString(e));
		}
	}

	@Test @Order(4) void testDownloadBin() {
		try (InputStream in = filesService.getDownloadStream(remoteImgFilePath).get()) {
			Assertions.assertNotNull(in);
			Utils.cacheBinFile(in, localCacheRootDir, FILE_NAME_IMG);
			Assertions.assertTrue(isFileContentEqual(localImgFilePath, localCacheRootDir + FILE_NAME_IMG));
		} catch (Exception e) {
			Assertions.fail(Throwables.getStackTraceAsString(e));
		}
	}

	@Test @Order(5) void testList() {
		Assertions.assertDoesNotThrow(() -> {
			List<FileInfo> files = filesService.list(remoteRootDir).get();
			Assertions.assertNotNull(files);
			Assertions.assertTrue(files.size() >= 2);
			List<String> names = files.stream().map(FileInfo::getName).collect(Collectors.toList());
			Assertions.assertTrue(names.contains(FILE_NAME_TXT));
			Assertions.assertTrue(names.contains(FILE_NAME_IMG));
		});
	}

	@Test @Order(6) void testHash() {
		Assertions.assertDoesNotThrow(() -> Assertions.assertNotNull(
				filesService.hash(remoteTxtFilePath).get()));
	}

	@Test @Order(7) void testMove() {
		Assertions.assertDoesNotThrow(() ->
				filesService.delete(remoteBackupTxtFilePath)
						.thenCompose(result -> filesService.move(remoteTxtFilePath, remoteBackupTxtFilePath))
						.get());
		verifyRemoteFileExists(remoteBackupTxtFilePath);
	}

	@Test @Order(8) void testCopy() {
		Assertions.assertDoesNotThrow(() ->
				filesService.copy(remoteBackupTxtFilePath, remoteTxtFilePath).get());
		verifyRemoteFileExists(remoteTxtFilePath);
	}

	@Test @Order(9) void testDeleteFile() {
		Assertions.assertDoesNotThrow(() ->
				filesService.delete(remoteTxtFilePath)
						.thenCompose(result -> filesService.delete(remoteBackupTxtFilePath))
						.get());
	}

	@Disabled
	@Test void testRemoteFileNotExistsException() {
		Assertions.assertThrows(ExecutionException.class,
				() -> filesService.hash(remoteNotExistsFilePath).get());
		//Assertions.assertEquals(e.getCause().getClass(), FileDoesNotExistsException.class);
	}

	@Disabled
	@Test void testVaultLockException() {
		// Assertions.assertDoesNotThrow(() -> subscription.deactivate().get());
		// VaultLockedException e = Assertions.assertThrows(VaultLockedException.class, this::uploadTextReally);
		// Assertions.assertNotNull(e);
		// Assertions.assertDoesNotThrow(() -> subscription.activate().get());
	}

	private static void verifyRemoteFileExists(String path) {
		verifyRemoteFileExists(filesService, path);
	}

	public static void verifyRemoteFileExists(FilesService filesService, String path) {
		Assertions.assertDoesNotThrow(() -> Assertions.assertNotNull(filesService.stat(path).get()));
	}

	public static void removeLocalFile(String filePath) {
		Assertions.assertDoesNotThrow(() -> Files.deleteIfExists(Paths.get(filePath)));
	}

	public static boolean isFileContentEqual(String srcFile, String dstFile) {
		try {
			Path file1 = Paths.get(srcFile);
			Path file2 = Paths.get(dstFile);
			final long size;
			size = Files.size(file1);
			if (size != Files.size(file2))
				return false;

			if (size < 4096)
				return Arrays.equals(Files.readAllBytes(file1), Files.readAllBytes(file2));

			try (InputStream is1 = Files.newInputStream(file1);
				 InputStream is2 = Files.newInputStream(file2)) {
				// Compare byte-by-byte.
				// Note that this can be sped up drastically by reading large chunks
				// (e.g. 16 KBs) but care must be taken as InputStream.read(byte[])
				// does not neccessarily read a whole array!
				int data;
				while ((data = is1.read()) != -1)
					if (data != is2.read())
						return false;
			}

			return true;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}
}
