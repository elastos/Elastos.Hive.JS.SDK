import { Collation } from "./collation";

export class DeleteOrder {
	public static readonly ASCENDING = 1;
	public static readonly DESCENDING = -1;
}

export class DeleteIndex {
	public key: string;
	public order: DeleteOrder;
}

export class DeleteOptions {
	public collation: Collation;
	public hint: DeleteIndex[];
}
