import { DataStorage } from '../../domain/datastorage';
import { BridgeHandler } from './bridgehandler';
import { ServiceContext } from '../servicecontext';
import { AuthService } from '../../restclient/auth/authservice';
import { HttpClient } from '../httpclient';
import { Logger } from '../../logger';
import { Claims, JWTParserBuilder } from '@elastosfoundation/did-js-sdk'

/**
 * The access token is made by hive node and represents the user DID and the application DID.
 *
 * <p>Some of the node APIs requires access token when handling request.</p>
 */
export class AccessToken {
	private static LOG = new Logger("AccessToken");
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
	public constructor(serviceContext: ServiceContext, storage: DataStorage) {
		this.authService = new AuthService(serviceContext, new HttpClient(serviceContext, HttpClient.NO_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS));
		this.storage = storage;
		this.bridge = new BridgeHandlerImpl(serviceContext);
	}

	// TEMPORARY DEBUG METHOD
	public getJwtCode(): string {
		return this.jwtCode;
	}

	/**
	 * Get the access token without exception.
	 *
	 * @return null if not exists.
	 */
	public async getCanonicalizedAccessToken(): Promise<string> {
		try {
			this.jwtCode = await this.fetch();
		} catch (e) {
			AccessToken.LOG.error("error on getCanonicalizedAccessToken: " + e);
			return null;
		}
		return "token " + this.jwtCode;
	}

	public async fetch(): Promise<string> {
		if (this.jwtCode != null) {
			return this.jwtCode;
		}

		this.jwtCode = this.restoreToken();
		if (this.jwtCode == null) {
			this.jwtCode = await this.authService.fetch();

			if (this.jwtCode != null) {
				await this.bridge.flush(this.jwtCode);
				this.saveToken(this.jwtCode);
			}
		} else {
			await this.bridge.flush(this.jwtCode);
		}
		return Promise.resolve(this.jwtCode);
	}

	public invalidate(): void {
		this.clearToken();
	}

	private restoreToken() : string {
		let endpoint = this.bridge.target() as ServiceContext;

		if (endpoint == null)
			return null;

		let jwtCode = null;
		let serviceDid;
		let address;

		serviceDid = endpoint.getServiceInstanceDid();
		address	= endpoint.getProviderAddress();

		if (serviceDid != null)
			jwtCode = this.storage.loadAccessToken(serviceDid);

		if (jwtCode != null && this.isExpired(jwtCode)) {
			this.storage.clearAccessTokenByAddress(address);
			serviceDid && this.storage.clearAccessToken(serviceDid);
		}

		if (jwtCode == null)
			jwtCode = this.storage.loadAccessTokenByAddress(address);


		if (jwtCode != null && this.isExpired(jwtCode)) {
			this.storage.clearAccessTokenByAddress(address);
			serviceDid && this.storage.clearAccessToken(serviceDid);
		}

		return jwtCode;
	}

	private isExpired(jwtCode: string) : boolean {
		// return System.currentTimeMillis() >= (getExpiresTime() * 1000);
		return false;
	}

	private saveToken( jwtCode: string) : void {
		let endpoint = this.bridge.target() as ServiceContext;
		if (endpoint == null || !endpoint.getServiceInstanceDid())
			return;

		this.storage.storeAccessToken(endpoint.getServiceInstanceDid(), jwtCode);
		this.storage.storeAccessTokenByAddress(endpoint.getProviderAddress(), jwtCode);
	}

	private clearToken(): void {
		let endpoint = this.bridge.target() as ServiceContext;
		if (endpoint == null)
			return;

		if (endpoint.getServiceInstanceDid()) {
			this.storage.clearAccessToken(endpoint.getServiceInstanceDid());
		}
		this.storage.clearAccessTokenByAddress(endpoint.getProviderAddress());
	}
}

class BridgeHandlerImpl implements BridgeHandler {
	private static LOG = new Logger("BridgeHandler");

    private ref: ServiceContext;

    constructor(endpoint: ServiceContext) {
		this.ref = endpoint;
    }

    public async flush(value: string): Promise<void> {
        try {
            let claims: Claims;
            claims = (await new JWTParserBuilder().build().parse(value)).getBody();
			this.ref.flushDids(claims.getAudience(), claims.getIssuer());
        } catch (e) {
            BridgeHandlerImpl.LOG.error("An error occured in the BridgeHandler");
            return;
        }
    }

    public target(): any {
        return this.ref;
    }
}