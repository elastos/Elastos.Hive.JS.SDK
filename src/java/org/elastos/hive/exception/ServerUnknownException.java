package org.elastos.hive.exception;

import org.elastos.hive.connection.NodeRPCException;

public class ServerUnknownException extends HiveException {
	private static final long serialVersionUID = 5210865275817148567L;

	public ServerUnknownException() {
		super("Impossible failure happened");
	}

	public ServerUnknownException(String message) {
		super(message);
	}

	public ServerUnknownException(int httpCode, String message) {
		super(String.format("Exception (http code: %d, message: %s)", httpCode, message));
	}

	public ServerUnknownException(NodeRPCException e) {
		this(e.getCode(), e.getMessage());
	}
}