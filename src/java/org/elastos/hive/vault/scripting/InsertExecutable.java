package org.elastos.hive.vault.scripting;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.gson.annotations.SerializedName;

public class InsertExecutable extends Executable {
    public InsertExecutable(String name, String collectionName, JsonNode document, JsonNode options) {
        super(name, Type.INSERT, null);
        super.setBody(new Body(collectionName, document, options));
    }

    public InsertExecutable(String name, String collectionName, JsonNode document) {
        this(name, collectionName, document, null);
    }

    private class Body extends DatabaseBody {
        @SerializedName("document")
        private JsonNode document;
        @SerializedName("options")
        private JsonNode options;

        public Body(String collection, JsonNode document, JsonNode options) {
            super(collection);
            this.document = document;
            this.options = options;
        }
    }
}
