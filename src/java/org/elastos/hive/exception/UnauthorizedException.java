package org.elastos.hive.exception;

import org.elastos.hive.connection.NodeRPCException;

public class UnauthorizedException extends SecurityException {
	private static final long serialVersionUID = -586039279266427101L;

	public UnauthorizedException() {
		super();
	}

	public UnauthorizedException(String message) {
		super(message);
	}

	public UnauthorizedException(String message, Throwable cause) {
		super(message, cause);
	}

	public UnauthorizedException(Throwable cause) {
		super(cause);
	}

	public UnauthorizedException(NodeRPCException e) {
		super(e.getMessage());
	}
}
