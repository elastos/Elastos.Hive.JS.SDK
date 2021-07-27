package org.elastos.hive.exception;

public class VaultForbiddenException extends NotFoundException {
	private static final long serialVersionUID = -586039279266427101L;

	public VaultForbiddenException() {
		super();
	}

	public VaultForbiddenException(String message) {
		super(message);
	}

	public VaultForbiddenException(String message, Throwable cause) {
		super(message, cause);
	}

	public VaultForbiddenException(Throwable cause) {
		super(cause);
	}
}
