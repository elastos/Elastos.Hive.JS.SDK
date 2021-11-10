import { Collation } from "./collation";

export enum DeleteOrder {
	ASCENDING = 1,
	DESCENDING = -1
}

export class DeleteIndex {
	public key: string;
	public order: DeleteOrder;
}

export class DeleteOptions {
	public collation: Collation;
	public hint: DeleteIndex[];
}
