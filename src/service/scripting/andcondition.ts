import { AggregatedCondition } from "./aggregatedcondition";
import { Condition } from "./condition";

/**
 * Vault script condition that succeeds only if all the contained conditions are successful.
 */
export class AndCondition extends AggregatedCondition {
	public constructor(name: string, conditions?: Condition[]) {
		super(name, AggregatedCondition.AND, conditions);
	}
}
