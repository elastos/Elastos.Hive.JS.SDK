import { Claims, DIDDocument, JWTParserBuilder } from '@elastosfoundation/did-js-sdk';
import { AppContextProvider } from '../../connection/auth/appcontextprovider';
import { HttpClient } from '../../connection/httpclient';
import { ServiceEndpoint } from '../../connection/serviceendpoint';
import { HttpResponseParser } from '../../connection/httpresponseparser';
import { NodeRPCException, ServerUnknownException } from '../../exceptions';
import { Logger } from '../../utils/logger';
import { RestService } from '../restservice';
import { HttpMethod } from '../../connection/httpmethod';

export class AuthService extends RestService {
	private static LOG = new Logger("AuthService");

	private static SIGN_IN_ENDPOINT = "/api/v2/did/signin";
	private static AUTH_ENDPOINT = "/api/v2/did/auth";

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
			throw NodeRPCException.forHttpCode(NodeRPCException.UNAUTHORIZED,"Failed to get token with signin", -1, e);
		}

        try {
            let challengeResponse: string = await this.contextProvider.getAuthorization(challenge);
            AuthService.LOG.debug("fetch::challenge response " + challengeResponse);

            const token = await this.auth(challengeResponse, await this.contextProvider.getAppInstanceDocument());
            AuthService.LOG.debug("fetch::token " + token);

            return token;
        } catch (e) {
            throw NodeRPCException.forHttpCode(NodeRPCException.UNAUTHORIZED,"Failed to get token with auth", -1, e);
        }
	}

    async signIn(appInstanceDidDoc: DIDDocument): Promise<string> {
        const payload = { "id": JSON.parse(appInstanceDidDoc.toString(true)) };
		const challenge: string = await this.httpClient.send(AuthService.SIGN_IN_ENDPOINT, payload, <HttpResponseParser<string>> {
			deserialize(content: any): string {
				AuthService.LOG.trace("return sign_in: " + content);
				return JSON.parse(content)['challenge'];
			}
		}, HttpMethod.POST);

        return this.checkValid(challenge, appInstanceDidDoc.getSubject().toString());
    }

    async auth(challengeResponse: string, appInstanceDidDoc: DIDDocument): Promise<string> {
		const payload = {"challenge_response": challengeResponse};
		const token: string = await this.httpClient.send(AuthService.AUTH_ENDPOINT, payload, <HttpResponseParser<string>> {
			deserialize(content: any): string {
				return JSON.parse(content)['token'];
			}
		}, HttpMethod.POST);

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