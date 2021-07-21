package org.elastos.hive.vault.database;

import com.google.gson.annotations.SerializedName;

public class UpdateOptions {
	@SerializedName("upsert")
	private Boolean upsert;
	@SerializedName("bypass_document_validation")
	private Boolean bypassDocumentValidation;

	public UpdateOptions setUpsert(Boolean upsert) {
		this.upsert = upsert;
		return this;
	}

	public UpdateOptions setBypassDocumentValidation(Boolean bypassDocumentValidation) {
		this.bypassDocumentValidation = bypassDocumentValidation;
		return this;
	}

	public Boolean getUpsert() {
		return upsert;
	}

	public Boolean getBypassDocumentValidation() {
		return bypassDocumentValidation;
	}
}
