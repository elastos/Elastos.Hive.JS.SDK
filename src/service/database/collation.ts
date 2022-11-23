export class CaseFirst {
	static UPPER = "upper";
	static LOWER = "lower";
	static OFF = "off";
}

export class Strength {
    static PRIMARY = 1;
    static SECONDARY = 2;
    static TERTIARY = 3;
    static QUATERNARY = 4;
    static IDENTICAL = 5;
}

export class Alternate {
	static NON_IGNORABLE = "non_ignorable";
	static SHIFTED = "shifted";
}

export class MaxVariable {
    static PUNCT = "punct";
	static SPACE = "space";
}

export class Collation {
	locale: string;
    caseLevel: boolean;
	caseFirst: CaseFirst;
	strength: Strength;
	numericOrdering: boolean;
	alternate: Alternate;
	maxVariable: MaxVariable;
	normalization: boolean;
	backwards: boolean;

	constructor() {}
}
