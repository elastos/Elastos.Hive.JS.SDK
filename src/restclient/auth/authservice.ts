import { Claims, DIDDocument, JWTParserBuilder } from '@elastosfoundation/did-js-sdk';
import { AppContextProvider } from '../../http/security/appcontextprovider';
import { HttpClient } from '../../http/httpclient';
import { ServiceContext } from '../../http/servicecontext';
import { HttpResponseParser } from '../../http/httpresponseparser';
import { NodeRPCException, ServerUnknownException } from '../../exceptions';
import { Logger } from '../../logger';
import { RestService } from '../restservice';
import { HttpMethod } from '../..';

export class AuthService extends RestService {
	private static LOG = new Logger("AuthService");

	private static SIGN_IN_ENDPOINT = "/api/v2/did/signin";
	private static AUTH_ENDPOINT = "/api/v2/did/auth";

	private contextProvider: AppContextProvider;

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		super(serviceContext, httpClient);
		this.contextProvider = serviceContext.getAppContext().getAppContextProvider();
    }

	public async fetch(): Promise<string> {
		try {
			HttpClient.LOG.debug("AuthService=>fetch");

			let appInstanceDoc = await this.contextProvider.getAppInstanceDocument();
			HttpClient.LOG.debug("AuthService=>appInstancedoc :" + appInstanceDoc.toString(true));

			let challenge: string  = await this.signIn(appInstanceDoc);
			HttpClient.LOG.debug("AuthService=>challenge :" + challenge);

			
			let challengeResponse: string = await this.contextProvider.getAuthorization(challenge);
			HttpClient.LOG.debug("challenge response " + challengeResponse);
			return this.auth(challengeResponse, await this.contextProvider.getAppInstanceDocument());
		} catch (e) {
			throw new NodeRPCException(401,-1, "Failed to get token by auth requests.");
		}
	}

    //@POST("/api/v2/did/signin")
	//Call<ChallengeRequest> signIn(@Body SignInRequest request);
    public async signIn(appInstanceDidDoc: DIDDocument): Promise<string> {
		
		let challenge: string = await this.httpClient.send(AuthService.SIGN_IN_ENDPOINT, { "document": JSON.parse(appInstanceDidDoc.toString(true)) }, <HttpResponseParser<string>> {
			deserialize(content: any): string {
				HttpClient.LOG.debug("return sign_in: " + content);				
				return JSON.parse(content)['challenge'];
			}
		}, HttpMethod.POST);

		AuthService.LOG.debug("challenge={} appInstanceDidDoc.getSubject().toString()={}", challenge, appInstanceDidDoc.getSubject().toString());
		if (! await this.checkValid(challenge, appInstanceDidDoc.getSubject().toString())) {
			AuthService.LOG.error("Failed to check the valid of challenge code when sign in.");
			throw new ServerUnknownException("Invalid challenge code, possibly being hacked.");
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
			AuthService.LOG.error("Failed to check the valid of access token when auth.");
			throw new ServerUnknownException("Invalid challenge code, possibly being hacked.");
		}
		return token;


    }

	private async checkValid(jwtCode: string, expectationDid: string): Promise<boolean> {
		try {
			let claims: Claims = (await new JWTParserBuilder().build().parse(jwtCode)).getBody();

			HttpClient.LOG.debug("Claims->getExpiration(): " + (claims.getExpiration()*1000 > Date.now()).toString());
			HttpClient.LOG.debug("Claims->getAudience(): " + claims.getAudience() + ":" + expectationDid);
			HttpClient.LOG.debug("is equal:" + (claims.getAudience() === expectationDid).toString());
			return claims.getExpiration()*1000 > Date.now() && claims.getAudience() === expectationDid;
		} catch (e) {
			AuthService.LOG.error("checkValid error: {}", e);
			return false;
		}
	}

}