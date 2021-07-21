package org.elastos.hive.endpoint;

import java.io.IOException;

import org.elastos.hive.connection.NodeRPCConnection;
import org.elastos.hive.exception.HiveException;
import org.elastos.hive.exception.NetworkException;

public class AboutController {
	private AboutAPI aboutAPI;

	public AboutController(NodeRPCConnection connection) {
		aboutAPI = connection.createService(AboutAPI.class, false);
	}

	public NodeVersion getNodeVersion() throws HiveException {
		try {
			return aboutAPI.version().execute().body();
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	public String getCommitId() throws HiveException {
		try {
			return aboutAPI.commitId().execute().body().getCommitId();
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}
}
