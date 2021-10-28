import { Condition } from "./condition";

export abstract class AggregatedCondition extends Condition {
    public static AND = "and";
    public static OR = "or";

	public constructor(name: string, type: string, conditions?: Condition[]) {
		super(name, type, conditions);
	}

	public setConditions(conditions: Condition[]): AggregatedCondition {
		super.setBody(conditions == null ? [] : conditions);
		return this;
	}

	public appendCondition(condition: Condition): AggregatedCondition {
		if (!condition) {
			return this;
        }
		if (!super.getBody()) {
			super.setBody([condition]);
		} else {
			(super.getBody() as Condition[]).push(condition);
		}
		return this;
	}
}
