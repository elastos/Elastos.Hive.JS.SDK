package org.elastos.hive.connection.auth;

import org.elastos.hive.connection.NodeRPCException;

public interface CodeFetcher {
	String fetch() throws NodeRPCException;
	void invalidate();
}
