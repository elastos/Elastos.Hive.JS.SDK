package org.elastos.hive.vault.database;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public class Index {
	private String key;
	private Order order;

	public enum Order {
		ASCENDING(1), DESCENDING(-1);

		private int value;

		Order(int value) {
			this.value = value;
		}

		@JsonValue
		public int value() {
			return value;
		}

		@JsonCreator
		public static Order fromInt(int i) {
		    switch (i) {
		    case 1:
		    	return ASCENDING;

		    case -1:
		    	return DESCENDING;

		    default:
		    	throw new IllegalArgumentException("Invalid index order");
		    }
		}

		@JsonCreator
		public static Order fromString(String name) {
			return valueOf(name.toUpperCase());
		}

	}

	public Index(String key, Order order) {
		this.key = key;
		this.order = order;
	}

	public String key() {
		return key;
	}

	public Order order() {
		return order;
	}
}
