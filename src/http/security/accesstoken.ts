import { CodeFetcher } from '../codefetcher';
import { DataStorage } from '../../domain/datastorage';
import { BridgeHandler } from './bridgehandler';
import { ServiceContext } from '../servicecontext';
import { AuthService } from '../../auth/authservice';
import { HttpClient } from '../httpclient';

/**
 * The access token is made by hive node and represents the user DID and the application DID.
 *
 * <p>Some of the node APIs requires access token when handling request.</p>
 */
export class AccessToken implements CodeFetcher {
	private jwtCode: string;
	private authService: AuthService;
	private storage: DataStorage;
	private bridge: BridgeHandler;

	/**
	 * Create the access token by service end point, data storage, and bridge handler.
	 *
	 * @param endpoint The service end point.
	 * @param storage The data storage which is used to save the access token.
	 * @param bridge The bridge handle is used for caller to do sth when getting the access token.
	 */
	public constructor(serviceContext: ServiceContext , storage: DataStorage , bridge: BridgeHandler) {
		this.authService = new AuthService(serviceContext, new HttpClient(serviceContext, HttpClient.DEFAULT_OPTIONS));
		this.storage = storage;
		this.bridge = bridge;
	}

	/**
	 * Get the access token without exception.
	 *
	 * @return null if not exists.
	 */
	public String getCanonicalizedAccessToken() {
		try {
			jwtCode = fetch();
		} catch (Exception e) {
			// TODO:
			return null;
		}
		return "token " + jwtCode;
	}

	public fetch(): string {
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

	public invalidate(): void {
		this.clearToken();
	}

	private String restoreToken() {
		ServiceContext endpoint = (ServiceContext)bridge.target();
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
		ServiceContext endpoint = (ServiceContext)bridge.target();
		if (endpoint == null)
			return;

		storage.storeAccessToken(endpoint.getServiceInstanceDid(), jwtCode);
		storage.storeAccessTokenByAddress(endpoint.getProviderAddress(), jwtCode);
	}

	private void clearToken() {
		ServiceContext endpoint = (ServiceContext)bridge.target();
		if (endpoint == null)
			return;

		storage.clearAccessToken(endpoint.getServiceInstanceDid());
		storage.clearAccessTokenByAddress(endpoint.getProviderAddress());
	}
}
