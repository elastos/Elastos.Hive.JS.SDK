import { JSONObject } from "@elastosfoundation/did-js-sdk";
import { SortItem } from "./sortitem";

export class QueryOptions {
	skip: number;
	limit: number;
	projection: JSONObject;
    sort: SortItem[];
	allow_partial_results: boolean;
	return_key: boolean;
	show_record_id: boolean;
	batch_size: number;
}
