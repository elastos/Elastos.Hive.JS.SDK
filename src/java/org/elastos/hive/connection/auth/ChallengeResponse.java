package org.elastos.hive.connection.auth;

import com.google.gson.annotations.SerializedName;

class ChallengeResponse {
	@SerializedName("challenge_response")
	private final String challengeResponse;

	ChallengeResponse(String challengeResponse) {
		this.challengeResponse = challengeResponse;
	}
}
