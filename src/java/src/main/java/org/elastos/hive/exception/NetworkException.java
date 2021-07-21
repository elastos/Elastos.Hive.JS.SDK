package org.elastos.hive.exception;

import java.io.IOException;

public class NetworkException extends HiveException {
	private static final long serialVersionUID = 4875908215630582817L;

	public NetworkException(IOException e) {
		super(String.format("Unkown network exception with message: %s",  e.getMessage()));
	}

	public NetworkException(String message) {
		super(String.format("Unkown network exception with message: %s", message));
	}
}
