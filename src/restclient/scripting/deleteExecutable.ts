import { Executable } from "../..";
import { ExecutableDatabaseBody, ExecutableType } from "./executable";

export class DeleteExecutable extends Executable {
    constructor(name: string, collectionName: string, filter: any) {
        super(name, ExecutableType.DELETE, null);
        super.setBody(new DeleteExecutable.Body(collectionName, filter));
    }

    // public DeleteExecutable( name: string, collectionName: string) {
    //     this(name, collectionName, null);
    // }

}

export namespace DeleteExecutable {

    export class Body extends ExecutableDatabaseBody {
        private filter: any;

        constructor( collection: string, filter: any) {
            super(collection);
            this.filter = filter;
        }
    }

}
// import com.fasterxml.jackson.databind.JsonNode;
// import com.google.gson.annotations.SerializedName;

// /**
//  * Convenient class to delete the documents from the collection.
//  */
// public class DeleteExecutable extends Executable {
//     public DeleteExecutable(String name, String collectionName, JsonNode filter) {
//         super(name, Type.DELETE, null);
//         super.setBody(new Body(collectionName, filter));
//     }

//     public DeleteExecutable(String name, String collectionName) {
//         this(name, collectionName, null);
//     }

//     private class Body extends DatabaseBody {
//         @SerializedName("filter")
//         private JsonNode filter;

//         public Body(String collection, JsonNode filter) {
//             super(collection);
//             this.filter = filter;
//         }
//     }
// }