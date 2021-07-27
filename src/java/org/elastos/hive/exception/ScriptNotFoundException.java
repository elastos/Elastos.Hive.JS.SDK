package org.elastos.hive.exception;

import org.elastos.hive.connection.NodeRPCException;

public class ScriptNotFoundException extends NotFoundException {
	private static final long serialVersionUID = -586039279266427101L;

	public ScriptNotFoundException() {
		super();
	}

	public ScriptNotFoundException(String message) {
		super(message);
	}

	public ScriptNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}

	public ScriptNotFoundException(Throwable cause) {
		super(cause);
	}

	public ScriptNotFoundException(NodeRPCException e) {
		super(e.getMessage());
	}
}
