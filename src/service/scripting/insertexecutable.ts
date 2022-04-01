import { Executable } from "./executable";
import { ExecutableDatabaseBody, ExecutableType } from "./executable";

export class InsertExecutableBody extends ExecutableDatabaseBody {
    private document: any;
    private options: any;

    constructor(collection:string, document: any, options: any) {
        super(collection);
        this.document = document;
        this.options = options;
    }
}
export class InsertExecutable extends Executable {
    constructor( name: string, collectionName: string, document: any, options: any) {
        super(name, ExecutableType.INSERT, null);
        super.setBody(new InsertExecutableBody(collectionName, document, options));
    }
        
    //     public InsertExecutable(String name, String collectionName, JsonNode document) {
    //         this(name, collectionName, document, null);
    //     }

}


// package org.elastos.hive.vault.scripting;

// import com.fasterxml.jackson.databind.JsonNode;
// import com.google.gson.annotations.SerializedName;

// /**
//  * The executable to wrapper the "insert" operation to the mongo database of the hive node.
//  */
// public class InsertExecutable extends Executable {
//     public InsertExecutable(String name, String collectionName, JsonNode document, JsonNode options) {
//         super(name, Type.INSERT, null);
//         super.setBody(new Body(collectionName, document, options));
//     }

//     public InsertExecutable(String name, String collectionName, JsonNode document) {
//         this(name, collectionName, document, null);
//     }

//     private class Body extends DatabaseBody {
//         @SerializedName("document")
//         private JsonNode document;
//         @SerializedName("options")
//         private JsonNode options;

//         public Body(String collection, JsonNode document, JsonNode options) {
//             super(collection);
//             this.document = document;
//             this.options = options;
//         }
//     }
// }