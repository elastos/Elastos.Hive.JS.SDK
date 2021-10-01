import { Executable } from "../..";

export class InsertExecutable extends Executable {
    constructor( name: string, collectionName: string, document: any, options: any) {
        super(name, Executable.Type.INSERT, null);
        super.setBody(new InsertExecutable.Body(collectionName, document, options));
    }
        
    //     public InsertExecutable(String name, String collectionName, JsonNode document) {
    //         this(name, collectionName, document, null);
    //     }

}


export namespace InsertExecutable {

    export class Body extends Executable.DatabaseBody {
        private document: any;
        private options: any;

        constructor(collection:string, document: any, options: any) {
            super(collection);
            this.document = document;
            this.options = options;
        }
    }
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