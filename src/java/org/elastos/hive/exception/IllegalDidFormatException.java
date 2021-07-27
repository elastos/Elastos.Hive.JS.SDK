package org.elastos.hive.exception;

public class IllegalDidFormatException extends IllegalArgumentException {
	private static final long serialVersionUID = -4051920494901326581L;
	private static final String message = "Invalid DID Document";

	public IllegalDidFormatException() {
		super(message);
	}

	public IllegalDidFormatException(String message) {
		super(message);
	}

	public IllegalDidFormatException(String message, Throwable cause) {
		super(message, cause);
	}

	public IllegalDidFormatException(Throwable cause) {
		super(cause);
	}
}
