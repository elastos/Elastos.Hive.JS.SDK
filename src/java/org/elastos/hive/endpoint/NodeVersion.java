package org.elastos.hive.endpoint;

import com.google.gson.annotations.SerializedName;

public class NodeVersion {
	@SerializedName("major")
	long major;

	@SerializedName("minor")
	long minor;

	@SerializedName("patch")
	long patch;

	public long major() {
		return major;
	}

	public long minor() {
		return minor;
	}

	public long patch() {
		return patch;
	}

	@Override
	public String toString() {
		return String.format("%d.%d.%d", major, minor, patch);
	}
}
