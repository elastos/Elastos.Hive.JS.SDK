import {JSONObject} from "@elastosfoundation/did-js-sdk";
import {SortItem} from "./sortitem";
import {FindOptions} from "./findoptions";

/**
 * The options of the querying operation.
 */
export class QueryOptions extends FindOptions {
	private projection: JSONObject;
    private sort: [string, number][];
	private allow_partial_results: boolean;
	private return_key: boolean;
	private show_record_id: boolean;
	private batch_size: number;

    setProjection(projection: JSONObject) {
        this.projection = projection;
        return this;
    }

    setSort(items: SortItem[]) {
        this.sort = items ? items.map((t) => [t.getKey(), t.getOrder()]) : undefined;
        return this;
    }

    setAllowPartialResults(isAllow: boolean) {
        this.allow_partial_results = isAllow;
        return this;
    }

    setReturnKey(isReturn: boolean) {
        this.return_key = isReturn;
        return this;
    }

    setShowRecordId(isShow: boolean) {
        this.show_record_id = isShow;
        return this;
    }

    setBatchSize(size: number) {
        this.batch_size = size;
        return this;
    }

    getProjection(): JSONObject {
        return this.projection;
    }

    getSort(): [string, number][] {
        return this.sort;
    }

    isAllowPartialResults(): boolean {
        return this.allow_partial_results;
    }

    isReturnKey(): boolean {
        return this.return_key;
    }

    isShowRecordId(): boolean {
        return this.show_record_id;
    }

    getBatchSize(): number {
        return this.batch_size;
    }
}
