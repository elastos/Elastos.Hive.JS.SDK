package org.elastos.hive.connection.auth;

import com.google.gson.annotations.SerializedName;

class ChallengeRequest {
	@SerializedName("challenge")
	private String challenge;

	String getChallenge() {
		return challenge;
	}
}
