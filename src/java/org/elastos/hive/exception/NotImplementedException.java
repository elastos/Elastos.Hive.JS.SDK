package org.elastos.hive.exception;

public class NotImplementedException extends UnsupportedOperationException {
	private static final long serialVersionUID = -3584593939670275718L;

	public NotImplementedException() {}

	public NotImplementedException(String message) {
		super(message);
	}

	public NotImplementedException(String message, Throwable cause) {
		super(message, cause);
	}

	public NotImplementedException(Throwable cause) {
		super(cause);
	}
}
