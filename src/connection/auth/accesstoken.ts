import { DataStorage } from '../../utils/storage/datastorage';
import { BridgeHandler } from './bridgehandler';
import { ServiceEndpoint } from '../serviceendpoint';
import { AuthService } from '../../service/auth/authservice';
import { HttpClient } from '../httpclient';
import { Logger } from '../../utils/logger';
import {Claims, JSONObject, JWTParserBuilder} from '@elastosfoundation/did-js-sdk'
import PromiseQueue from "promise-queue";
import {CodeFetcher, SHA256} from "../..";

/**
 * The access token is made by hive node and represents the user DID and the application DID.
 *
 * <p>Some of the node APIs requires access token when handling request.</p>
 */
export class AccessToken implements CodeFetcher {
	private static LOG = new Logger("AccessToken");

    private endpoint: ServiceEndpoint;
    private authService: AuthService;
	private bridge: BridgeHandler;

	// queue to make sure no multiple access token from hive node at the same time.
	private readonly tokenQueues: {[key: string]: PromiseQueue};

    private jwtCode: string;
    private storageKey: string;

	/**
	 * Create the access token by service end point, data storage, and bridge handler.
	 *
	 * @param endpoint The service end point.
	 * @param storage The data storage which is used to save the access token.
	 */
	constructor(endpoint: ServiceEndpoint, storage: DataStorage) {
	    this.endpoint = endpoint;
		this.authService = new AuthService(endpoint, new HttpClient(endpoint, HttpClient.NO_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS));
		this.bridge = new BridgeHandlerImpl(endpoint);
		this.tokenQueues = {};
		this.jwtCode = null;
        this.storageKey = null;
	}

	// TEMPORARY DEBUG METHOD
	getJwtCode(): string {
		return this.jwtCode;
	}

    private getStorageKey(): string {
        if (!this.storageKey) {
            const userDid = this.endpoint.getUserDid();
            const appDid = this.endpoint.getAppDid();
            const nodeDid = this.endpoint.getServiceInstanceDid();

            this.storageKey = SHA256.encodeToStr(`${userDid};${appDid};${nodeDid}`);
        }
        return this.storageKey;
    }

	private getTokenQueue(): PromiseQueue {
	    const key = this.getStorageKey();
	    if (!(key in this.tokenQueues)) {
	        this.tokenQueues[key] = new PromiseQueue(1);
        }
	    return this.tokenQueues[key];
    }

	/**
	 * Get the access token without exception.
	 *
	 * @return null if not exists.
	 */
	async getCanonicalizedAccessToken(): Promise<string> {
		try {
		    const queue: PromiseQueue = this.getTokenQueue();
            const token = await queue.add(async () => {return await this.fetch();});
		    return "token " + token;
		} catch (e) {
			AccessToken.LOG.error("error on getCanonicalizedAccessToken: " + e);
			throw e;
		}
	}

	async fetch(): Promise<string> {
		if (this.jwtCode != null) {
			return this.jwtCode;
		}

        // try to refresh source node did, etc. to generate storage key.
        if (!this.endpoint.getServiceInstanceDid() || !this.endpoint.getAppDid()) {
            this.jwtCode = await this.fetchFromRemote();
            return this.jwtCode;
        }

        // restore from local
		this.jwtCode = await this.restoreToken();
        if (this.jwtCode != null) {
            return this.jwtCode;
        }

        // restore from remote.
        this.jwtCode = await this.fetchFromRemote();
        return this.jwtCode;
	}

	invalidate(): Promise<void> {
		return new Promise(resolve => {
            this.clearToken();
            resolve();
        });
	}

	private async fetchFromRemote(): Promise<string> {
        const jwtCode = await this.authService.fetch();

        const key = this.getStorageKey();
        this.endpoint.getStorage().storeAccessToken(key, jwtCode);

        await this.bridge.flush(jwtCode);
        return jwtCode;
    }

	private async restoreToken() : Promise<string> {
        const key = this.getStorageKey();

        const jwtCode = this.endpoint.getStorage().loadAccessToken(key);
        if (jwtCode != null) {
            await this.bridge.flush(this.jwtCode);
        }

        if (jwtCode == null || await this.isExpired(jwtCode)) {
            this.endpoint.getStorage().clearAccessToken(key);
            return null;
        }

		return jwtCode;
	}

	private async isExpired(jwtCode: string) : Promise<boolean> {
        let claims : Claims = (await new JWTParserBuilder().setAllowedClockSkewSeconds(300).build().parse(jwtCode)).getBody();
        if (claims == null)
            return true;

        return claims.getExpiration() * 1000 < Date.now();
	}

	private clearToken() {
        const key = this.getStorageKey();
        this.endpoint.getStorage().clearAccessToken(key);
	}
}

class BridgeHandlerImpl implements BridgeHandler {
	private static LOG = new Logger("BridgeHandler");

    private readonly endpoint: ServiceEndpoint;

    constructor(endpoint: ServiceEndpoint) {
		this.endpoint = endpoint;
    }

    /**
     * Flash access token
     * @param accessToken
     */
    async flush(accessToken: string): Promise<void> {
        try {
            const claims: Claims = (await new JWTParserBuilder().setAllowedClockSkewSeconds(300).build().parse(accessToken)).getBody();
            const props: JSONObject = claims.getAsObject('props');
			this.endpoint.flushDids(claims.getAudience(), props['appDid'] as string, claims.getIssuer());
        } catch (e) {
            BridgeHandlerImpl.LOG.error("An error occured in the BridgeHandler");
            throw e;
        }
    }

    target(): any {
        return this.endpoint;
    }
}