import {DataStorage} from '../../utils/storage/datastorage';
import {BridgeHandler} from './bridgehandler';
import {ServiceEndpoint} from '../serviceendpoint';
import {AuthService} from '../../service/auth/authservice';
import {Logger} from '../../utils/logger';
import {Claims, JWTParserBuilder} from '@elastosfoundation/did-js-sdk'
import PromiseQueue from "promise-queue";
import {CodeFetcher, SHA256} from "../..";

/**
 * The access token is made by hive node and represents the user DID and the application DID.
 *
 * <p>Some of the node APIs requires access token when handling request.</p>
 */
export class AccessToken implements CodeFetcher {
	private static LOG = new Logger("AccessToken");
	
	/**
     * Queue to make sure no multiple access token from hive node at the same time.
     *
     * /signin can only handle specific appInsDid linearly,
     * so the queue set globally.
     *
     * @private
     */
    private static readonly tokenQueue: PromiseQueue = new PromiseQueue(1);

    private endpoint: ServiceEndpoint;
    private authService: AuthService;
	private bridge: BridgeHandler;

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
		this.authService = new AuthService(endpoint);
		this.bridge = new BridgeHandlerImpl(endpoint);
		this.jwtCode = null;
        this.storageKey = null;
	}

    private async getStorageKey(): Promise<string> {
        if (!this.storageKey) {
            const userDid = this.endpoint.getUserDid();
            const appDid = this.endpoint.getAppDid();
            const providerAddress = await this.endpoint.getProviderAddress();

            this.storageKey = SHA256.encodeToStr(`${userDid};${appDid};${providerAddress}`);
        }
        return this.storageKey;
    }

	async fetch(): Promise<string> {
		if (this.jwtCode != null) {
			return this.jwtCode;
		}

        this.jwtCode = await AccessToken.tokenQueue.add(async () => {
            // restore from local
            let code = await this.restoreToken();
            if (code != null) {
                return code;
            }

            // restore from remote.
            code = await this.fetchFromRemote();
            return code;
        });
        return this.jwtCode;
	}

	invalidate(): Promise<void> {
		return this.clearToken();
	}

	private async fetchFromRemote(): Promise<string> {
        const jwtCode = await this.authService.fetch();

        const key = await this.getStorageKey();
        this.endpoint.getStorage().storeAccessToken(key, jwtCode);

        await this.bridge.flush(jwtCode);
        return jwtCode;
    }

	private async restoreToken() : Promise<string> {
        const key = await this.getStorageKey();

        const jwtCode = this.endpoint.getStorage().loadAccessToken(key);
        if (jwtCode == null) {
            return null;
        }

        if (await this.isExpired(jwtCode)) {
            await this.clearToken(key);
            return null;
        }

        await this.bridge.flush(jwtCode);
		return jwtCode;
	}

	private async isExpired(jwtCode: string) : Promise<boolean> {
	    try {
            let claims : Claims = (await new JWTParserBuilder().setAllowedClockSkewSeconds(300).build().parse(jwtCode)).getBody();
            if (claims == null)
                return true;

            return claims.getExpiration() * 1000 < Date.now();
        } catch (e) {
            AccessToken.LOG.info(`Got an error when checking token expired: ${e}, ${e.stack}`);
            return true;
        }
	}

	private async clearToken(key?: string) {
        const key_ = key ? key : await this.getStorageKey();
        this.endpoint.getStorage().clearAccessToken(key_);
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
            // const props: JSONObject = claims.getAsObject('props');
			this.endpoint.flushDids(claims.getAudience(), claims.getIssuer());
        } catch (e) {
            BridgeHandlerImpl.LOG.error("An error occured in the BridgeHandler");
            throw e;
        }
    }

    target(): any {
        return this.endpoint;
    }
}