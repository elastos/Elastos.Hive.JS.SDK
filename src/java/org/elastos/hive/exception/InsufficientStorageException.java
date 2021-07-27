package org.elastos.hive.exception;

public class InsufficientStorageException extends NotFoundException {
	private static final long serialVersionUID = -586039279266427101L;

	public InsufficientStorageException() {
		super();
	}

	public InsufficientStorageException(String message) {
		super(message);
	}

	public InsufficientStorageException(String message, Throwable cause) {
		super(message, cause);
	}

	public InsufficientStorageException(Throwable cause) {
		super(cause);
	}
}
