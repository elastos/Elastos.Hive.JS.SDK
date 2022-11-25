import {Condition} from "./condition";
import {InvalidParameterException} from "../../exceptions";

/**
 * The aggregated condition uses 'and' or 'or' to aggregate conditions
 * which also includes aggregated conditions.
 */
export abstract class AggregatedCondition extends Condition {
    protected static AND = "and";
    protected static OR = "or";

	protected constructor(name: string, type: string, conditions?: Condition[]) {
		super(name, type, conditions ? conditions : []);
	}

	appendCondition(condition: Condition): AggregatedCondition {
        if (!condition)
            throw new InvalidParameterException('Invalid condition');

        if (condition instanceof AggregatedCondition) {
            if (condition.getBody())
                super.getBody().push(...condition.getBody());
        } else {
            super.getBody().push(condition);
        }
        return this;
	}
}
