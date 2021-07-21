package org.elastos.hive.vault.database;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.gson.annotations.SerializedName;

class CountParams {
    @SerializedName("filter")
    private JsonNode filter;

    @SerializedName("options")
    private CountOptions options;

    public CountParams(JsonNode filter, CountOptions options) {
        this.filter = filter;
        this.options = options;
    }
}
