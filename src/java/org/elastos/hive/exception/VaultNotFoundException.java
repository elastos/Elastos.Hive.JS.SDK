package org.elastos.hive.exception;

public class VaultNotFoundException extends NotFoundException {
	private static final long serialVersionUID = -586039279266427101L;

	public VaultNotFoundException() {
		super();
	}

	public VaultNotFoundException(String message) {
		super(message);
	}

	public VaultNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}

	public VaultNotFoundException(Throwable cause) {
		super(cause);
	}
}
