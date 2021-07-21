package org.elastos.hive.vault.files;

import com.google.gson.annotations.SerializedName;

import java.util.List;

class ChildrenInfo {
	@SerializedName("value")
	private List<FileInfo> value;

	public List<FileInfo> getValue() {
		return value;
	}
}
