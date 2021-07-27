package org.elastos.hive.vault.database;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.gson.annotations.SerializedName;

class UpdateParams {
    @SerializedName("filter")
    private JsonNode filter;

    @SerializedName("update")
    private JsonNode update;

    @SerializedName("options")
    private UpdateOptions options;

    public UpdateParams(JsonNode filter, JsonNode update, UpdateOptions options) {
    	this.filter = filter;
    	this.update = update;
    	this.options = options;
    }
}
