package org.elastos.hive.exception;

import org.elastos.hive.connection.NodeRPCException;

public class BackupNotFoundException extends NotFoundException {
	private static final long serialVersionUID = -5537222473332097613L;

	public BackupNotFoundException() {
		super();
	}

	public BackupNotFoundException(String message) {
		super(message);
	}

	public BackupNotFoundException(NodeRPCException e) {
		super(e.getMessage());
	}
}
