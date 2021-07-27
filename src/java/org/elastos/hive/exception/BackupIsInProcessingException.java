package org.elastos.hive.exception;

public class BackupIsInProcessingException extends NotFoundException {
	private static final long serialVersionUID = -586039279266427101L;

	public BackupIsInProcessingException() {
		super();
	}

	public BackupIsInProcessingException(String message) {
		super(message);
	}

	public BackupIsInProcessingException(String message, Throwable cause) {
		super(message, cause);
	}

	public BackupIsInProcessingException(Throwable cause) {
		super(cause);
	}
}
