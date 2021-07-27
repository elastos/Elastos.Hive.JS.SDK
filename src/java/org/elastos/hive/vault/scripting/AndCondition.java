package org.elastos.hive.vault.scripting;

import java.util.List;

/**
 * Vault script condition that succeeds only if all the contained conditions are successful.
 */
public class AndCondition extends AggregatedCondition {
	public AndCondition(String name, List<Condition> conditions) {
		super(name, Type.AND, conditions);
	}

	public AndCondition(String name) {
		this(name, null);
	}
}
