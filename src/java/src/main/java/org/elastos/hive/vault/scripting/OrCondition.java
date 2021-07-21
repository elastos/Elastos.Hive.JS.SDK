package org.elastos.hive.vault.scripting;

import java.util.List;

/**
 * Vault script condition that succeeds if at least one of the contained conditions are successful.
 * Contained conditions are tested in the given order, and test stops as soon as one successful condition
 * succeeds.
 */
public class OrCondition extends AggregatedCondition {
	public OrCondition(String name, List<Condition> conditions) {
		super(name, Type.OR, conditions);
	}

	public OrCondition(String name) {
		this(name, null);
	}
}
