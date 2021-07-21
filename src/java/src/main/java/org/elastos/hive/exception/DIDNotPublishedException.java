package org.elastos.hive.exception;

public class DIDNotPublishedException extends IllegalArgumentException {
	private static final long serialVersionUID = 6312243380551675785L;

	public DIDNotPublishedException() {
		super();
	}

	public DIDNotPublishedException(String message) {
		super(message);
	}

	public DIDNotPublishedException(String message, Throwable cause) {
		super(message, cause);
	}

	public DIDNotPublishedException(Throwable cause) {
		super(cause);
	}
}
