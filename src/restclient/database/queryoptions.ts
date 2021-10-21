import { JSONObject } from "@elastosfoundation/did-js-sdk/typings";
import { SortItem } from "./sortitem";

export class QueryOptions {
	public skip: number;
	public limit: number;
	public projection: JSONObject;
    public sort: SortItem[];
	public allow_partial_results: boolean;
	public return_key: boolean;
	public show_record_id: boolean;
	public batch_size: number;
}
