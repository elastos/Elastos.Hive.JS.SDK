package org.elastos.hive.vault.database;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.gson.annotations.SerializedName;

import java.util.List;

class FindResult {
	// TODO: change 'items' to 'docs' ?
    @SerializedName("items")
    private List<JsonNode> documents;

    public List<JsonNode> documents() {
    	return documents;
    }
}