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

    constructor( collectionName: string, filter: any, options: QueryHasResultConditionOptions) {
        this.collection = collectionName;
        this.filter = filter;
        this.options = options;
    }
}

export class QueryHasResultCondition extends Condition {
    
    private static TYPE = "queryHasResults";

    constructor(name: string, collectionName: string, filter: any,  options: QueryHasResultConditionOptions) {
        super(name, QueryHasResultCondition.TYPE, null);
        super.setBody(new QueryHasResultConditionBody(collectionName, filter, options));
    }

}



// package org.elastos.hive.vault.scripting;

// import com.fasterxml.jackson.databind.JsonNode;

// /**
//  * Vault script condition to check if a database query returns results or not.
//  * This is a way for example to check if a user is in a group, if a message contains comments, if a user
//  * is in a list, etc.
//  */
// public class QueryHasResultCondition extends Condition {
//     private static final String TYPE = "queryHasResults";

//     public QueryHasResultCondition(String name, String collectionName, JsonNode filter, Options options) {
//         super(name, TYPE, null);
//         super.setBody(new Body(collectionName, filter, options));
//     }

//     public QueryHasResultCondition(String name, String collectionName, JsonNode filter) {
//         this(name, collectionName, filter, null);
//     }

//     public class Options {
//         private Integer skip;
//         private Integer limit;
//         private Integer maxTimeMS;

//         public Options(Integer skip, Integer limit, Integer maxTimeMS) {
//             this.skip = skip;
//             this.limit = limit;
//             this.maxTimeMS = maxTimeMS;
//         }
//     }

//     private class Body {
//         private String collection;
//         private JsonNode filter;
//         private Options options;

//         public Body(String collectionName, JsonNode filter, Options options) {
//             this.collection = collectionName;
//             this.filter = filter;
//             this.options = options;
//         }
//     }
// }