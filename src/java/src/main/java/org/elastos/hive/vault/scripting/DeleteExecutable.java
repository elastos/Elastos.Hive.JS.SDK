package org.elastos.hive.vault.scripting;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.gson.annotations.SerializedName;

public class DeleteExecutable extends Executable {
    public DeleteExecutable(String name, String collectionName, JsonNode filter) {
        super(name, Type.DELETE, null);
        super.setBody(new Body(collectionName, filter));
    }

    public DeleteExecutable(String name, String collectionName) {
        this(name, collectionName, null);
    }

    private class Body extends DatabaseBody {
        @SerializedName("filter")
        private JsonNode filter;

        public Body(String collection, JsonNode filter) {
            super(collection);
            this.filter = filter;
        }
    }
}
