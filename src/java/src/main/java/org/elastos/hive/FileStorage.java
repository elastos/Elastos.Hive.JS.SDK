package org.elastos.hive;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;

class FileStorage implements DataStorage {
	private static final String BACKUP = "credential-backup";
	private static final String TOKENS = "tokens";

	private String basePath;

	public FileStorage(String rootPath, String userDid) {
		String path = rootPath;
		if (!path.endsWith(File.separator))
			path += File.separator;

		path += compatDid(userDid);
		this.basePath = path;

		File file = new File(path);
		if (!file.exists())
			file.mkdirs();
	}

	@Override
	public String loadBackupCredential(String serviceDid) {
		return readContent(makeFullPath(BACKUP, compatDid(serviceDid)));
	}

	@Override
	public String loadAccessToken(String serviceDid) {
		return readContent(makeFullPath(TOKENS, compatDid(serviceDid)));
	}

	@Override
	public String loadAccessTokenByAddress(String providerAddress) {
		return readContent(makeFullPath(TOKENS, sha256(providerAddress)));
	}

	@Override
	public void storeBackupCredential(String serviceDid, String credential) {
		writeContent(makeFullPath(BACKUP, compatDid(serviceDid)), credential);
	}

	@Override
	public void storeAccessToken(String serviceDid, String accessToken) {
		writeContent(makeFullPath(TOKENS, compatDid(serviceDid)), accessToken);
	}

	@Override
	public void storeAccessTokenByAddress(String providerAddress, String accessToken) {
		writeContent(makeFullPath(TOKENS, sha256(providerAddress)), accessToken);
	}

	@Override
	public void clearBackupCredential(String serviceDid) {
		deleteContent(makeFullPath(BACKUP, compatDid(serviceDid)));
	}

	@Override
	public void clearAccessToken(String serviceDid) {
		deleteContent(makeFullPath(TOKENS, compatDid(serviceDid)));
	}

	@Override
	public void clearAccessTokenByAddress(String providerAddress) {
		deleteContent(makeFullPath(TOKENS, sha256(providerAddress)));
	}

	private String readContent(String path) {
		if (path == null)
			return null;

		Path p = Paths.get(path);
		if (!Files.exists(p))
			return null;

		try {
			return new String(Files.readAllBytes(p));
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	private void writeContent(String path, String content) {
		if (path == null)
			return;

		File parent = Paths.get(path).getParent().toFile();
		if (!parent.exists())
			parent.mkdirs();

		if (!parent.exists())
			return;

		try {
			Files.write(Paths.get(path), content.getBytes(StandardCharsets.UTF_8));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private void deleteContent(String path) {
		if (path == null)
			return;

		try {
			Files.deleteIfExists(Paths.get(path));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private String makeFullPath(String segPath, String fileName) {
		return this.basePath
					+ File.separator
					+ segPath
					+ File.separator
					+ fileName;
	}

	private String compatDid(String did) {
		String[] parts = did.split(":");
		return parts.length >= 3 ? parts[2] : did;
	}

	private String sha256(String message) {
		byte[] bytes;

		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			digest.update(message.getBytes("UTF-8"));
			bytes = digest.digest();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

		StringBuffer buffer = new StringBuffer();
		String temp = null;

		for (int i = 0; i < bytes.length; i++) {
			temp = Integer.toHexString(bytes[i] & 0xFF);
			if (temp.length() == 1)
				buffer.append("0");

			buffer.append(temp);
		}
		return buffer.toString();
	}
}
