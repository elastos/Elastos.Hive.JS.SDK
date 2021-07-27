package org.elastos.hive.vault.scripting;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.gson.annotations.SerializedName;

/**
 * Client side representation of a back-end execution that runs a mongo "find" query and returns some items
 * as a result.
 */
public class FindExecutable extends Executable {
	public FindExecutable(String name, String collectionName, JsonNode filter, JsonNode options) {
		super(name, Type.FIND, null);
		super.setBody(new Body(collectionName, filter, options));
	}

	public FindExecutable(String name, String collectionName, JsonNode filter) {
		this(name, collectionName, filter, null);
	}

	private class Body extends DatabaseBody {
		@SerializedName("filter")
		private JsonNode filter;
		@SerializedName("options")
		private JsonNode options;

		public Body(String collection, JsonNode filter, JsonNode options) {
			super(collection);
			this.filter = filter;
			this.options = options;
		}
	}
}
