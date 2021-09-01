import { Condition } from "./condition";


export class Executable extends Condition {

    //@SerializedName("output")
    output: boolean;
   
    constructor(name: string, type: Executable.Type, body: object) {
        super(name, type as string, body);
    }

    public setOutput(output: boolean): Executable  {
        this.output = output;
        return this;
    }



}

export namespace Executable {

    export enum Type {
        AGGREGATED = "aggregated",
        FIND = "find",
        INSERT = "insert",
		UPDATE = "update",
		DELETE = "delete",
		FILE_UPLOAD = "fileUpload",
		FILE_DOWNLOAD = "fileDownload",
		FILE_PROPERTIES = "fileProperties",
        FILE_HASH = "fileHash"

        // Do we need that? ***************************************
        // 		private String value;
        // 		Type(String value) {
        // 			this.value = value;
        // 		}
        // 		String getValue() {
        // 			return value;
        // 		}
    }

    export class DatabaseBody {
		//@SerializedName("collection")
		collection: string;
		constructor(collection: string) {
			this.collection = collection;
		}
    }
    
    export class FileBody {
		//@SerializedName("path")
		private path: string;

		public FileBody() {
			this.path = "$params.path";
		}
	}

    // TODO: serialization strategy
	// static JsonNode createRunFileParams(path: string) {
	// 	ObjectNode node = JsonNodeFactory.instance.objectNode();
	// 	node.put("path", path);
	// 	return node;
	// }

    
}
