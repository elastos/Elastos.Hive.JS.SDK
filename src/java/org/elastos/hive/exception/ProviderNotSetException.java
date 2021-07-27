package org.elastos.hive.exception;

public class ProviderNotSetException extends IllegalStateException {
	private static final long serialVersionUID = -586039279266427101L;

	public ProviderNotSetException() {
		super();
	}

	public ProviderNotSetException(String message) {
		super(message);
	}

	public ProviderNotSetException(String message, Throwable cause) {
		super(message, cause);
	}

	public ProviderNotSetException(Throwable cause) {
		super(cause);
	}
}
