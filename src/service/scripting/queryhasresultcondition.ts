import { Condition } from "./condition";

export class QueryHasResultConditionOptions {
    private skip: number;
    private limit: number;
    private maxTimeMS: number;

    constructor(skip: number, limit: number, maxTimeMS: number) {
        this.skip = skip;
        this.limit = limit;
        this.maxTimeMS = maxTimeMS;
    }
}

export class QueryHasResultConditionBody {
    private collection: string;
    private filter: any;
    private options: QueryHasResultConditionOptions;

    constructor( collectionName: string, filter: any, options?: QueryHasResultConditionOptions) {
        this.collection = collectionName;
        this.filter = filter;
        this.options = options ? options : undefined;
    }
}

export class QueryHasResultCondition extends Condition {
    private static TYPE = "queryHasResults";

    constructor(name: string, collectionName: string, filter: any,  options?: QueryHasResultConditionOptions) {
        super(name, QueryHasResultCondition.TYPE, new QueryHasResultConditionBody(collectionName, filter, options));
    }
}
