package org.elastos.hive.connection.auth;

import com.google.gson.annotations.SerializedName;

class SignInRequest {
	@SerializedName("id")
	private Object didDocument;

	SignInRequest(Object didDocument) {
		this.didDocument = didDocument;
	}
}
