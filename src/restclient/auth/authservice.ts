import { DIDDocument } from '@elastosfoundation/did-js-sdk/typings';
import { SignInRequest } from './signinrequest';
import { ChallengeRequest } from './challengerequest';
import { AppContextProvider } from '../../http/security/appcontextprovider';
import { AccessToken } from '../../http/security/accesstoken';
import { HttpClient } from '../../http/httpclient';
import { ServiceContext } from '../../http/servicecontext';
import { HttpResponseParser } from '../../http/httpresponseparser';
import { NodeRPCException, ServerUnknownException } from '../../exceptions';
import { Claims } from '../../domain/jwt/claims';
import { JWTParserBuilder } from '../../domain/jwt/jwtparserbuilder';
import { Logger } from '../../logger';

export class AuthService {
	private static LOG = new Logger("AuthService");

	private static SIGN_IN_ENDPOINT = "/api/v2/did/signin";
	private static AUTH_ENDPOINT = "/api/v2/did/auth";

	private httpClient: HttpClient;
	private serviceContext: ServiceContext;
	private contextProvider: AppContextProvider;

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		this.serviceContext = serviceContext;
		this.httpClient = httpClient;
		this.contextProvider = serviceContext.getAppContext().getAppContextProvider();
    }

	public async fetch(): Promise<string> {
		try {
			let challenge: string  = await this.signIn(this.contextProvider.getAppInstanceDocument());

			let challengeResponse: string = await this.contextProvider.getAuthorization(challenge);
			return this.auth(challengeResponse, this.contextProvider.getAppInstanceDocument());
		} catch (e) {
			throw new NodeRPCException(401,-1, "Failed to get token by auth requests.");
		}
	}

    //@POST("/api/v2/did/signin")
	//Call<ChallengeRequest> signIn(@Body SignInRequest request);
    public async signIn(appInstanceDidDoc: DIDDocument): Promise<string> {
		let challenge: string = await this.httpClient.send(AuthService.SIGN_IN_ENDPOINT, appInstanceDidDoc.toString(), <HttpResponseParser<string>> {
			deserialize(content: any): string {
				return JSON.parse(content)['challenge'];
			}
		});

		if (!this.checkValid(challenge, appInstanceDidDoc.getSubject().toString())) {
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
		});

		if (!this.checkValid(token, appInstanceDidDoc.getSubject().toString())) {
			AuthService.LOG.error("Failed to check the valid of access token when auth.");
			throw new ServerUnknownException("Invalid challenge code, possibly being hacked.");
		}
		return token;


    }

	private async checkValid(jwtCode: string, expectationDid: string): Promise<boolean> {
		try {
			let claims: Claims = (await new JWTParserBuilder().build().parse(jwtCode)).getBody();
			return claims.getExpiration() > Date.now() &&
					claims.getAudience().equals(expectationDid);
		} catch (e) {
			return false;
		}
	}

}

/*

package org.elastos.hive.connection.auth;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.elastos.did.DIDDocument;
import org.elastos.did.jwt.Claims;
import org.elastos.did.jwt.JwtParserBuilder;
import org.elastos.hive.connection.NodeRPCConnection;
import org.elastos.hive.connection.NodeRPCException;
import org.elastos.hive.exception.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.security.InvalidParameterException;
import java.util.HashMap;

public class AuthController {
	private static final Logger log = LoggerFactory.getLogger(AuthController.class);
	private AuthAPI authAPI;
	private String expectationAudience;

	public AuthController(NodeRPCConnection connection, DIDDocument appInstanceDidDoc ) {
		this.authAPI = connection.createService(AuthAPI.class, false);
		this.expectationAudience = appInstanceDidDoc.getSubject().toString();
	}

	public String signIn(DIDDocument appInstanceDidDoc) throws HiveException {
		try {
			Object document = new ObjectMapper()
							.readValue(appInstanceDidDoc.toString(), HashMap.class);

			ChallengeRequest challenge;
			challenge = authAPI.signIn(new SignInRequest(document))
							.execute()
							.body();

			if (!checkValid(challenge.getChallenge(), expectationAudience)) {
				log.error("Failed to check the valid of challenge code when sign in.");
				throw new ServerUnknownException("Invalid challenge code, possibly being hacked.");
			}
			return challenge.getChallenge();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	public String auth(String challengeResponse) throws HiveException {
		try {
			AccessCode token = authAPI.auth(new ChallengeResponse(challengeResponse))
							.execute()
							.body();

			if (!checkValid(token.getToken(), expectationAudience)) {
				log.error("Failed to check the valid of access token when auth.");
				throw new ServerUnknownException("Invalid challenge code, possibly being hacked.");
			}
			return token.getToken();

		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.BAD_REQUEST:
					throw new InvalidParameterException(e.getMessage());
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
	}

	private boolean checkValid(String jwtCode, String expectationDid) {
		try {
			Claims claims = new JwtParserBuilder()
					.build()
					.parseClaimsJws(jwtCode)
					.getBody();
			return claims.getExpiration().getTime() > System.currentTimeMillis() &&
					claims.getAudience().equals(expectationDid);
		} catch (Exception e) {
			return false;
		}
	}
}
*/