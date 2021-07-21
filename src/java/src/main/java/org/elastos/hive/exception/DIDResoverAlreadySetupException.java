package org.elastos.hive.exception;

public class DIDResoverAlreadySetupException extends IllegalStateException {
	private static final long serialVersionUID = -8823832432398445720L;
	private static final String message = "Resolver already settup, replicated setup not allowed";

	public DIDResoverAlreadySetupException() {
		super(message);
	}

	public DIDResoverAlreadySetupException(String message) {
		super(message);
	}

	public DIDResoverAlreadySetupException(String message, Throwable cause) {
		super(message, cause);
	}

	public DIDResoverAlreadySetupException(Throwable cause) {
		super(cause);
	}
}
