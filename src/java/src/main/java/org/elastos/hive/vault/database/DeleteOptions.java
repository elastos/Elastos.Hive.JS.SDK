package org.elastos.hive.vault.database;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.google.gson.annotations.SerializedName;

public class DeleteOptions {
	@SerializedName("collation")
	private Collation collation;

	@SerializedName("hint")
	private List<Index> hint;

	public DeleteOptions(Collation collation, Index hint) {
		collation(collation);
		hint(hint);
	}

	public DeleteOptions(Collation collation, List<Index> hint) {
		collation(collation);
		hint(hint);
	}

	public DeleteOptions() {
	}

	public DeleteOptions collation(Collation value) {
		collation = value;
		return this;
	}

	public Collation collation() {
		return collation;
	}

	public DeleteOptions hint(Index value) {
		if (value == null) {
			hint = null;
		} else {
			if (hint == null)
				hint = new ArrayList<Index>();

			hint.add(value);
		}

		return this;
	}

	public DeleteOptions hint(List<Index> value) {
		if (value == null || value.isEmpty()) {
			hint = null;
		} else {
			if (hint == null)
				hint = new ArrayList<Index>();

			hint.addAll(value);
		}

		return this;
	}

	public DeleteOptions hint(Index[] value) {
		if (value == null || value.length == 0) {
			hint = null;
		} else {
			if (hint == null)
				hint = new ArrayList<Index>();

			hint.addAll(Arrays.asList(value));
		}

		return this;
	}

	public List<Index> hint() {
		return hint;
	}
}

