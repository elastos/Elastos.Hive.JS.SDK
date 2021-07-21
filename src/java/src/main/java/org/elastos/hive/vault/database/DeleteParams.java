package org.elastos.hive.vault.database;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.gson.annotations.SerializedName;

class DeleteParams {
	@SerializedName("filter")
	private JsonNode filter;

	@SerializedName("options")
    private DeleteOptions options;

    public DeleteParams(JsonNode filter, DeleteOptions options) {
        this.filter = filter;
        this.options = options;
    }
}
