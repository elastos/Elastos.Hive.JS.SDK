package org.elastos.hive.connection.auth;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface AuthAPI {
	@POST("/api/v2/did/signin")
	Call<ChallengeRequest> signIn(@Body SignInRequest request);

	@POST("/api/v2/did/auth")
	Call<AccessCode> auth(@Body ChallengeResponse request);
}
