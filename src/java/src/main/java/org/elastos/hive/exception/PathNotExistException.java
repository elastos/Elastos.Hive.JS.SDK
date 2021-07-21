package org.elastos.hive.exception;

import org.elastos.hive.connection.NodeRPCException;

public class PathNotExistException extends NotFoundException {
	private static final long serialVersionUID = 5181597396226755904L;

	public PathNotExistException() {
		super();
	}

	public PathNotExistException(String message) {
		super(message);
	}

	public PathNotExistException(NodeRPCException e) {
		super(e.getMessage());
	}
}
