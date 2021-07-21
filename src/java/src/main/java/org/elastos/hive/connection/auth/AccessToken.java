package org.elastos.hive.connection.auth;

import org.elastos.hive.ServiceEndpoint;
import org.elastos.hive.connection.NodeRPCException;
import org.elastos.hive.DataStorage;

public class AccessToken implements CodeFetcher {
	private String jwtCode;
	private CodeFetcher remoteFetcher;
	private DataStorage storage;
	private BridgeHandler bridge;

	public AccessToken(ServiceEndpoint endpoint, DataStorage storage, BridgeHandler bridge) {
		remoteFetcher = new RemoteFetcher(endpoint);
		this.storage = storage;
		this.bridge = bridge;
	}

	public String getCanonicalizedAccessToken() {
		try {
			jwtCode = fetch();
		} catch (Exception e) {
			// TODO:
			return null;
		}
		return "token " + jwtCode;
	}

	@Override
	public String fetch() throws NodeRPCException {
		if (jwtCode != null)
			return jwtCode;

		jwtCode = restoreToken();
		if (jwtCode == null) {
			jwtCode = remoteFetcher.fetch();

			if (jwtCode != null) {
				bridge.flush(jwtCode);
				saveToken(jwtCode);
			}
		} else {
			bridge.flush(jwtCode);
		}
		return jwtCode;
	}

	@Override
	public void invalidate() {
		clearToken();
	}

	private String restoreToken() {
		ServiceEndpoint endpoint = (ServiceEndpoint)bridge.target();
		if (endpoint == null)
			return null;

		String jwtCode = null;
		String serviceDid;
		String address;

		serviceDid = endpoint.getServiceInstanceDid();
		address	= endpoint.getProviderAddress();

		if (serviceDid != null)
			jwtCode = storage.loadAccessToken(serviceDid);

		if (jwtCode != null && isExpired(jwtCode)) {
			storage.clearAccessTokenByAddress(address);
			storage.clearAccessToken(serviceDid);
		}

		if (jwtCode == null)
			jwtCode = storage.loadAccessTokenByAddress(address);


		if (jwtCode != null && isExpired(jwtCode)) {
			storage.clearAccessTokenByAddress(address);
			storage.clearAccessToken(serviceDid);
		}

		return jwtCode;
	}

	private boolean isExpired(String jwtCode) {
		// return System.currentTimeMillis() >= (getExpiresTime() * 1000);
		return false;
	}

	private void saveToken(String jwtCode) {
		ServiceEndpoint endpoint = (ServiceEndpoint)bridge.target();
		if (endpoint == null)
			return;

		storage.storeAccessToken(endpoint.getServiceInstanceDid(), jwtCode);
		storage.storeAccessTokenByAddress(endpoint.getProviderAddress(), jwtCode);
	}

	private void clearToken() {
		ServiceEndpoint endpoint = (ServiceEndpoint)bridge.target();
		if (endpoint == null)
			return;

		storage.clearAccessToken(endpoint.getServiceInstanceDid());
		storage.clearAccessTokenByAddress(endpoint.getProviderAddress());
	}
}
