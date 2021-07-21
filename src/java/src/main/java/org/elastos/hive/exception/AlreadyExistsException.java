package org.elastos.hive.exception;

import org.elastos.hive.connection.NodeRPCException;

public class AlreadyExistsException extends RuntimeException {
	private static final long serialVersionUID = -586039279266427101L;

	public AlreadyExistsException() {
		super();
	}

	public AlreadyExistsException(String message) {
		super(message);
	}

	public AlreadyExistsException(String message, Throwable cause) {
		super(message, cause);
	}

	public AlreadyExistsException(Throwable cause) {
		super(cause);
	}

	public AlreadyExistsException(NodeRPCException e) {
		super(e.getMessage());
	}
}
