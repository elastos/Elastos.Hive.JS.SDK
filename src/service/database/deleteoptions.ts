import { Collation } from "./collation";

export class DeleteOrder {
	static readonly ASCENDING = 1;
	static readonly DESCENDING = -1;
}

export class DeleteIndex {
	key: string;
	order: DeleteOrder;
}

export class DeleteOptions {
	collation: Collation;
	hint: DeleteIndex[];
}
