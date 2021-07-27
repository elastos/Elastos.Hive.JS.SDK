package org.elastos.hive.vault.scripting;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

abstract class AggregatedCondition extends Condition {
	protected enum Type {
		AND("and"), OR("or");

		private String value;

		Type(String value) {
			this.value = value;
		}

		public String getValue() {
			return value;
		}
	}

	public AggregatedCondition(String name, Type type, List<Condition> conditions) {
		super(name, type.getValue(), conditions);
	}

	public AggregatedCondition(String name, Type type) {
		this(name, type, null);
	}

	public AggregatedCondition setConditions(List<Condition> conditions) {
		super.setBody(conditions == null ? new ArrayList<>() : conditions);
		return this;
	}

	public AggregatedCondition appendCondition(Condition condition) {
		if (condition == null)
			return this;

		if (super.getBody() == null) {
			super.setBody(Collections.singletonList(condition));
		} else {
			((List<Condition>)super.getBody()).add(condition);
		}
		return this;
	}
}
