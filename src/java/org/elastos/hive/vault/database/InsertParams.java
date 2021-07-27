package org.elastos.hive.vault.database;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.gson.annotations.SerializedName;

import java.util.List;

class InsertParams {
    @SerializedName("document")
    private List<JsonNode> documents;

    @SerializedName("options")
    private InsertOptions options;

    public InsertParams(List<JsonNode> documents, InsertOptions options) {
    	this.documents = documents;
    	this.options = options;
    }
}
