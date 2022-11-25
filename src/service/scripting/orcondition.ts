import {AggregatedCondition} from "./aggregatedcondition";
import {Condition} from "./condition";

/**
 * Vault script condition that succeeds if at least one of the contained conditions are successful.
 * Contained conditions are tested in the given order, and test stops as soon as one successful condition
 * succeeds.
 */
export class OrCondition extends AggregatedCondition {
    constructor(name: string, conditions?: Condition[]) {
        super(name, AggregatedCondition.OR, conditions);
    }
}
