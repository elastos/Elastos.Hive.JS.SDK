package org.elastos.hive.vault.files;

import java.io.*;
import java.net.HttpURLConnection;
import java.security.InvalidParameterException;
import java.util.List;

import org.elastos.hive.connection.NodeRPCConnection;
import org.elastos.hive.connection.NodeRPCException;
import org.elastos.hive.connection.UploadOutputStream;
import org.elastos.hive.connection.UploadOutputStreamWriter;
import org.elastos.hive.exception.*;

public class FilesController {
	private NodeRPCConnection connection;
	private FilesAPI filesAPI;

	public FilesController(NodeRPCConnection connection) {
		this.connection = connection;
		this.filesAPI = connection.createService(FilesAPI.class, true);
	}

	public OutputStream getUploadStream(String path) throws HiveException {
		try {
			HttpURLConnection urlConnection = connection.openConnection(FilesAPI.API_UPLOAD + path);
			return new UploadOutputStream(urlConnection, urlConnection.getOutputStream());
		} catch (NodeRPCException e) {
			// INFO: The error code and message can be found on stream closing.
			throw new ServerUnknownException(e);
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	public Writer getUploadWriter(String path) throws HiveException {
		try {
			HttpURLConnection urlConnection = connection.openConnection(FilesAPI.API_UPLOAD + path);
			return new UploadOutputStreamWriter(urlConnection, urlConnection.getOutputStream());
		} catch (NodeRPCException e) {
			// INFO: The error code and message can be found on stream closing.
			throw new ServerUnknownException(e);
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	public InputStream getDownloadStream(String path) throws HiveException {
		try {
			return filesAPI.download(path).execute().body().byteStream();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	public Reader getDownloadReader(String path) throws HiveException {
		try {
			return new InputStreamReader(filesAPI.download(path).execute().body().byteStream());
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	public List<FileInfo> listChildren(String path) throws HiveException {
		try {
			return filesAPI.listChildren(path).execute().body().getValue();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	public FileInfo getProperty(String path) throws HiveException {
		try {
			return filesAPI.getMetadata(path).execute().body();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	public String getHash(String path) throws HiveException {
		try {
			return filesAPI.getHash(path).execute().body().getHash();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	public void copyFile(String srcPath, String destPath) throws HiveException {
		try {
			filesAPI.copy(srcPath, destPath).execute();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	public void moveFile(String srcPath, String destPath) throws HiveException {
		try {
			filesAPI.move(srcPath, destPath).execute();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				case NodeRPCException.NOT_FOUND:
					throw new NotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	public void delete(String path) throws HiveException {
		try {
			filesAPI.delete(path).execute();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.FORBIDDEN:
					throw new VaultForbiddenException(e);
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}
}
