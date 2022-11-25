import {Condition} from "./condition";

export class QueryHasResultConditionOptions {
    constructor(private skip: number, private limit: number, private maxTimeMS: number) {}

    getSkip(): number {
        return this.skip;
    }

    getLimit(): number {
        return this.limit;
    }

    getMaxTimeMS(): number {
        return this.maxTimeMS;
    }
}

export class QueryHasResultConditionBody {
    constructor(private collection: string, private filter: any, private options?: QueryHasResultConditionOptions) {}

    getCollection(): string {
        return this.collection;
    }

    getFilter(): any {
        return this.filter;
    }

    getOptions(): QueryHasResultConditionOptions {
        return this.options;
    }
}

/**
 * One condition type which to find whether the specific collection has some matched documents.
 */
export class QueryHasResultCondition extends Condition {
    private static TYPE = "queryHasResults";

    constructor(name: string, collectionName: string, filter: any, options?: QueryHasResultConditionOptions) {
        super(name, QueryHasResultCondition.TYPE, new QueryHasResultConditionBody(collectionName, filter, options));
    }
}
