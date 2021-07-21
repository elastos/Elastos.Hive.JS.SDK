package org.elastos.hive.backup.promotion;

import org.elastos.hive.connection.NodeRPCConnection;
import org.elastos.hive.exception.HiveException;
import org.elastos.hive.exception.NotImplementedException;

public class PromotionController {
	public PromotionController(NodeRPCConnection connection) {}

	public void promote() throws HiveException {
		throw new NotImplementedException();

		/*
		try {
			api.promoteToVault().execute().body();
		} catch (NodeRPCException e) {
			throw new UnknownServerException(e);
		} catch (IOException e) {
			throw new NetworkException(e);
		}
		*/
	}
}
