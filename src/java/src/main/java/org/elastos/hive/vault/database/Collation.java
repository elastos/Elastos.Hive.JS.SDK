package org.elastos.hive.vault.database;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.google.gson.annotations.SerializedName;

public class Collation {
	@SerializedName("locale")
	private String locale;

	@SerializedName("caseLevel")
	private Boolean caseLevel;

	@SerializedName("caseFirst")
	private CaseFirst caseFirst;

	@SerializedName("strength")
	private Strength strength;

	@SerializedName("numericOrdering")
	private Boolean numericOrdering;

	@SerializedName("alternate")
	private Alternate alternate;

	@SerializedName("maxVariable")
	private MaxVariable maxVariable;

	@SerializedName("normalization")
	private Boolean normalization;

	@SerializedName("backwards")
	private Boolean backwards;

	public enum CaseFirst {
		UPPER, LOWER, OFF;

		@Override
		@JsonValue
		public String toString() {
			return name().toLowerCase();
		}

		@JsonCreator
		public static CaseFirst fromString(String name) {
			return valueOf(name.toUpperCase());
		}
	}

	public enum Strength {
		PRIMARY(1),
		SECONDARY(2),
		TERTIARY(3),
		QUATERNARY(4),
		IDENTICAL(5);

		private int value;

		Strength(int value) {
			this.value = value;
		}

		@JsonValue
		public int value() {
			return value;
		}

		@JsonCreator
		public static Strength fromInt(int i) {
			switch (i) {
			case 1:
				return PRIMARY;

			case 2:
				return SECONDARY;

			case 3:
				return TERTIARY;

			case 4:
				return QUATERNARY;

			case 5:
				return IDENTICAL;

			default:
				throw new IllegalArgumentException("Invalid strength");
			}
		}
	}

	public enum Alternate {
		NON_IGNORABLE, SHIFTED;

		@Override
		@JsonValue
		public String toString() {
			return name().toLowerCase();
		}

		@JsonCreator
		public static Alternate fromString(String name) {
			return valueOf(name.toUpperCase());
		}
	}

	public enum MaxVariable {
		PUNCT, SPACE;

		@Override
		@JsonValue
		public String toString() {
			return name().toLowerCase();
		}

		@JsonCreator
		public static MaxVariable fromString(String name) {
			return valueOf(name.toUpperCase());
		}
	}

	public Collation(String locale, boolean caseLevel, CaseFirst caseFirst,
			Strength strength, boolean numericOrdering, Alternate alternate,
			MaxVariable maxVariable, boolean normalization, boolean backwards) {
		locale(locale);
		caseLevel(caseLevel);
		caseFirst(caseFirst);
		strength(strength);
		numericOrdering(numericOrdering);
		alternate(alternate);
		maxVariable(maxVariable);
		normalization(normalization);
		backwards(backwards);
	}

	public Collation() {}

	public Collation locale(String value) {
		locale = value;
		return this;
	}

	public String getLocale() {
		return locale;
	}

	public Collation caseLevel(boolean value) {
		caseLevel = value;
		return this;
	}

	public Boolean getCaseLevel() {
		return caseLevel;
	}

	public Collation caseFirst(CaseFirst value) {
		caseFirst = value;
		return this;
	}

	public CaseFirst getCaseFirst() {
		return caseFirst;
	}

	public Collation strength(Strength value) {
		strength = value;
		return this;
	}

	public Strength Strength() {
		return strength;
	}

	public Collation numericOrdering(boolean value) {
		numericOrdering = value;
		return this;
	}

	public Boolean numericOrdering() {
		return numericOrdering;
	}

	public Collation alternate(Alternate value) {
		alternate = value;
		return this;
	}

	public Alternate alternate() {
		return alternate;
	}

	public Collation maxVariable(MaxVariable value) {
		maxVariable = value;
		return this;
	}

	public MaxVariable maxVariable() {
		return maxVariable;
	}

	public Collation normalization(boolean value) {
		normalization = value;
		return this;
	}

	public Boolean normalization() {
		return normalization;
	}

	public Collation backwards(boolean value) {
		backwards = value;
		return this;
	}

	public Boolean backwards() {
		return backwards;
	}
}
