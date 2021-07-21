package org.elastos.hive.vault.database;

import com.google.gson.annotations.SerializedName;

public class InsertOptions {
	@SerializedName("bypass_document_validation")
	Boolean bypassDocumentValidation;

	@SerializedName("ordered")
	boolean ordered;

	public InsertOptions() {
		this(false, false);
	}

	public InsertOptions(Boolean bypassDocumentValidation) {
		this(bypassDocumentValidation, false);
	}

	public InsertOptions(Boolean bypassDocumentValidation, Boolean ordered) {
		this.bypassDocumentValidation = bypassDocumentValidation;
		this.ordered = ordered;
	}

	public InsertOptions bypassDocumentValidation(Boolean bypassDocumentValidation) {
		this.bypassDocumentValidation = bypassDocumentValidation;
		return this;
	}

	public InsertOptions ordered(Boolean value) {
		ordered = value;
		return this;
	}
}
