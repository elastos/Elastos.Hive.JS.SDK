import {Claims, DIDDocument, JWTParserBuilder} from '@elastosfoundation/did-js-sdk';
import {AppContextProvider} from '../../connection/auth/appcontextprovider';
import {HttpClient} from '../../connection/httpclient';
import {ServiceEndpoint} from '../../connection/serviceendpoint';
import {UnauthorizedException} from '../../exceptions';
import {Logger} from '../../utils/logger';
import {RestServiceT} from '../restservice';
import {AuthAPI} from "./authapi";

export class AuthService extends RestServiceT<AuthAPI> {
	private static LOG = new Logger("AuthService");

	private contextProvider: AppContextProvider;

    constructor(serviceContext: ServiceEndpoint, httpClient: HttpClient) {
		super(serviceContext, httpClient);
		this.contextProvider = serviceContext.getAppContext().getAppContextProvider();
    }

	async fetch(): Promise<string> {
        AuthService.LOG.trace("fetch::start fetch the access token");

        const appInstanceDoc = await this.contextProvider.getAppInstanceDocument();
        AuthService.LOG.trace("fetch::application instance document:" + appInstanceDoc.toString(true));

        let challenge: string = null;
		try {
			challenge  = await this.signIn(appInstanceDoc);
			AuthService.LOG.debug("fetch::challenge :" + challenge);
		} catch (e) {
            throw new UnauthorizedException('Failed to get token with signin()', e);
		}

        try {
            let challengeResponse: string = await this.contextProvider.getAuthorization(challenge);
            AuthService.LOG.debug("fetch::challenge response " + challengeResponse);

            const token = await this.auth(challengeResponse, await this.contextProvider.getAppInstanceDocument());
            AuthService.LOG.debug("fetch::token " + token);

            return token;
        } catch (e) {
            throw new UnauthorizedException('Failed to get token with auth()', e);
        }
	}

    async signIn(appInstanceDidDoc: DIDDocument): Promise<string> {
        const challenge: string = await this.callAPI(AuthAPI, async api => {
            return await api.signIn({"id": JSON.parse(appInstanceDidDoc.toString(true))});
        });
        return this.checkValid(challenge, appInstanceDidDoc.getSubject().toString());
    }

    async auth(challengeResponse: string, appInstanceDidDoc: DIDDocument): Promise<string> {
        const token: string = await this.callAPI(AuthAPI, async api => {
            return await api.auth({"challenge_response": challengeResponse});
        });
        return this.checkValid(token, appInstanceDidDoc.getSubject().toString());
    }

	private async checkValid(jwtCode: string, expectationDid: string): Promise<string> {
        let claims: Claims = null;

        try {
            claims = (await new JWTParserBuilder().setAllowedClockSkewSeconds(300).build().parse(jwtCode)).getBody();

            AuthService.LOG.trace("Claims->getExpiration(): " + (claims.getExpiration() * 1000 > Date.now()).toString());
            AuthService.LOG.trace("Claims->getAudience(): " + claims.getAudience() + ":" + expectationDid);
            AuthService.LOG.trace("is equal:" + (claims.getAudience() === expectationDid).toString());
        } catch (e) {
            throw new Error(`failed to parse jwt string: ${JSON.stringify(e)}`);
        }

        if (claims.getExpiration() * 1000 < Date.now()) {
            throw new Error('jwt string expired');
        }
        if (claims.getAudience() !== expectationDid) {
            throw new Error(`jwt string with invalid audience: ${claims.getAudience()}, expected: ${expectationDid}`);
        }

        return jwtCode;
	}
}
