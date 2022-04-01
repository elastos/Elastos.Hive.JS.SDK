import { Executable } from "./executable";
import { ExecutableDatabaseBody, ExecutableType } from "./executable";

export class UpdateExecutable extends Executable {
	constructor( name: string,  collectionName: string,  filter: any,  update:any,  options: any) {
		super(name, ExecutableType.UPDATE, null);
		super.setBody(new UpdateExecutableBody(collectionName, filter, update, options));
    }
}



export class UpdateExecutableBody extends ExecutableDatabaseBody {
    private filter: any;
    private update: any;
    private options: any;

    constructor(collection:string, filter: any, update:any, options: any) {
        super(collection);
        this.filter = filter;
        this.update = update;
        this.options = options;
    }
}

// package org.elastos.hive.vault.scripting;

// import com.fasterxml.jackson.databind.JsonNode;
// import com.google.gson.annotations.SerializedName;

// /**
//  * The executable to update the documents of the mongo database.
//  */
// public class UpdateExecutable extends Executable {
//     public UpdateExecutable(String name, String collectionName,
//                             JsonNode filter, JsonNode update, JsonNode options) {
//         super(name, Type.UPDATE, null);
//         super.setBody(new Body(collectionName, filter, update, options));
//     }

//     public UpdateExecutable(String name, String collectionName,
//                             JsonNode filter, JsonNode update) {
//         this(name, collectionName, filter, update, null);
//     }

//     private class Body extends DatabaseBody {
//         @SerializedName("filter")
//         private JsonNode filter;
//         @SerializedName("update")
//         private JsonNode update;
//         @SerializedName("options")
//         private JsonNode options;

//         public Body(String collection, JsonNode filter, JsonNode update, JsonNode options) {
//             super(collection);
//             this.filter = filter;
//             this.update = update;
//             this.options = options;
//         }
//     }
// }