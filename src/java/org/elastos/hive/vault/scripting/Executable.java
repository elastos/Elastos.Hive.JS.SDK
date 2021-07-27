package org.elastos.hive.vault.scripting;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.annotations.SerializedName;

public abstract class Executable extends Condition {
	protected enum Type {
		AGGREGATED("aggregated"), // TODO:
		FIND("find"),
		INSERT("insert"),
		UPDATE("update"),
		DELETE("delete"),
		FILE_UPLOAD("fileUpload"),
		FILE_DOWNLOAD("fileDownload"),
		FILE_PROPERTIES("fileProperties"),
		FILE_HASH("fileHash");

		private String value;

		Type(String value) {
			this.value = value;
		}

		String getValue() {
			return value;
		}
	}

	@SerializedName("output")
	private Boolean output;

	protected Executable(String name, Type type, Object body) {
		super(name, type.getValue(), body);
	}

	public Executable setOutput(Boolean output) {
		this.output = output;
		return this;
	}

	protected abstract class DatabaseBody {
		@SerializedName("collection")
		String collection;
		DatabaseBody(String collection) {
			this.collection = collection;
		}
	}

	protected class FileBody {
		@SerializedName("path")
		private String path;

		public FileBody() {
			this.path = "$params.path";
		}
	}

	public static JsonNode createRunFileParams(String path) {
		ObjectNode node = JsonNodeFactory.instance.objectNode();
		node.put("path", path);
		return node;
	}
}
