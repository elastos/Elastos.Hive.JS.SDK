package org.elastos.hive.exception;

public class DIDResolverNotSetupException extends IllegalStateException {
	private static final long serialVersionUID = 4868071788117985924L;
	private static final String message = "DID Resolver has not been setup before instantiation";

	public DIDResolverNotSetupException() {
		super(message);
	}

	public DIDResolverNotSetupException(String message) {
		super(message);
	}

	public DIDResolverNotSetupException(String message, Throwable cause) {
		super(message, cause);
	}

	public DIDResolverNotSetupException(Throwable cause) {
		super(cause);
	}
}
