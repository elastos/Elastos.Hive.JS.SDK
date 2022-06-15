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

	public async fetch(): Promise<string> {
        AuthService.LOG.trace("AuthService=>fetch");

        let appInstanceDoc = await this.contextProvider.getAppInstanceDocument();
        AuthService.LOG.trace("AuthService=>appInstancedoc :" + appInstanceDoc.toString(true));

        let challenge: string = null;
		try {
			challenge  = await this.signIn(appInstanceDoc);
			AuthService.LOG.debug("AuthService=>challenge :" + challenge);
		} catch (e) {
			throw NodeRPCException.forHttpCode(NodeRPCException.UNAUTHORIZED,"Failed to get token with signin", -1, e);
		}

        try {
            let challengeResponse: string = await this.contextProvider.getAuthorization(challenge);
            AuthService.LOG.debug("challenge response " + challengeResponse);
            return this.auth(challengeResponse, await this.contextProvider.getAppInstanceDocument());
        } catch (e) {
            throw NodeRPCException.forHttpCode(NodeRPCException.UNAUTHORIZED,"Failed to get token with auth", -1, e);
        }
	}

    //@POST("/api/v2/did/signin")
	//Call<ChallengeRequest> signIn(@Body SignInRequest request);
    public async signIn(appInstanceDidDoc: DIDDocument): Promise<string> {
		
		let challenge: string = await this.httpClient.send(AuthService.SIGN_IN_ENDPOINT, { "id": JSON.parse(appInstanceDidDoc.toString(true)) }, <HttpResponseParser<string>> {
			deserialize(content: any): string {
				AuthService.LOG.trace("return sign_in: " + content);				
				return JSON.parse(content)['challenge'];
			}
		}, HttpMethod.POST);

		AuthService.LOG.trace("challenge={} appInstanceDidDoc.getSubject().toString()={}", challenge, appInstanceDidDoc.getSubject().toString());
		if (! await this.checkValid(challenge, appInstanceDidDoc.getSubject().toString())) {
			throw new ServerUnknownException(NodeRPCException.SERVER_EXCEPTION, "Invalid `challenge` from `signin`.");
		}
		return challenge;
    }

	//@POST("/api/v2/did/auth")
	//Call<AccessCode> auth(@Body ChallengeResponse request);
    public async auth(challengeResponse: string, appInstanceDidDoc: DIDDocument): Promise<string> {
		let challengeResponseRequest = {
			"challenge_response": challengeResponse
		};
		let token: string = await this.httpClient.send(AuthService.AUTH_ENDPOINT, challengeResponseRequest, <HttpResponseParser<string>> {
			deserialize(content: any): string {
				return JSON.parse(content)['token'];
			}
		}, HttpMethod.POST);

		if (! await this.checkValid(token, appInstanceDidDoc.getSubject().toString())) {
			throw new ServerUnknownException(NodeRPCException.SERVER_EXCEPTION, "Invalid `token` from `auth`");
		}
		return token;
    }

	private async checkValid(jwtCode: string, expectationDid: string): Promise<boolean> {
		try {
			let claims: Claims = (await new JWTParserBuilder().setAllowedClockSkewSeconds(300).build().parse(jwtCode)).getBody();

			AuthService.LOG.trace("Claims->getExpiration(): " + (claims.getExpiration()*1000 > Date.now()).toString());
			AuthService.LOG.trace("Claims->getAudience(): " + claims.getAudience() + ":" + expectationDid);
			AuthService.LOG.trace("is equal:" + (claims.getAudience() === expectationDid).toString());
			return claims.getExpiration()*1000 > Date.now() && claims.getAudience() === expectationDid;
		} catch (e) {
			return false;
		}
	}

}