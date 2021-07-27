package org.elastos.hive.vault.database;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.gson.annotations.SerializedName;

class QueryParams {
    @SerializedName("collection")
    private String collection;
    @SerializedName("filter")
    private JsonNode filter;
    @SerializedName("options")
    private QueryOptions options;

    public QueryParams(String collectionName, JsonNode filter, QueryOptions options) {
        this.collection = collectionName;
    	this.filter = filter;
    	this.options = options;
    }
}
