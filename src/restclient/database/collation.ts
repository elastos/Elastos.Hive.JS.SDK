export enum CaseFirst {
	UPPER = "upper",
	LOWER = "lower",
	OFF = "off"
}

export enum Strength {
    PRIMARY = 1,
    SECONDARY = 2,
    TERTIARY = 3,
    QUATERNARY = 4,
    IDENTICAL = 5
}

export enum Alternate {
	NON_IGNORABLE = "non_ignorable",
	SHIFTED = "shifted"
}

export enum MaxVariable {
    PUNCT = "punct",
	SPACE = "space"
}

export class Collation {
	public locale: string;
    public caseLevel: boolean;
	public caseFirst: CaseFirst;
	public strength: Strength;
	public numericOrdering: boolean;
	public alternate: Alternate;
	public maxVariable: MaxVariable;
	public normalization: boolean;
	public backwards: boolean;

	public constructor() {}
}
