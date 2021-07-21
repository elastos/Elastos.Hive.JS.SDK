package org.elastos.hive.connection.auth;

import com.google.gson.annotations.SerializedName;

class AccessCode {
	@SerializedName("token")
	private String token;

	String getToken() {
		return token;
	}
}
