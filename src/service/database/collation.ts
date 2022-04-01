export class CaseFirst {
	public static UPPER = "upper";
	public static LOWER = "lower";
	public static OFF = "off";
}

export class Strength {
    public static PRIMARY = 1;
    public static SECONDARY = 2;
    public static TERTIARY = 3;
    public static QUATERNARY = 4;
    public static IDENTICAL = 5;
}

export class Alternate {
	public static NON_IGNORABLE = "non_ignorable";
	public static SHIFTED = "shifted";
}

export class MaxVariable {
    public static PUNCT = "punct";
	public static SPACE = "space";
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
