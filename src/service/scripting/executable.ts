import {InvalidParameterException} from "../../exceptions";
import {ScriptEntity} from "./scriptentity";

/**
 * Defines all possible executable types.
 */
export class ExecutableType {
    static AGGREGATED = "aggregated";
    static FIND = "find";
    static COUNT = "count";
    static INSERT = "insert";
    static UPDATE = "update";
    static DELETE = "delete";
    static FILE_UPLOAD = "fileUpload";
    static FILE_DOWNLOAD = "fileDownload";
    static FILE_PROPERTIES = "fileProperties";
    static FILE_HASH = "fileHash";
}

/**
 * The base class of the executable.
 *
 * An executable represents an executing body of the script.
 */
export abstract class Executable extends ScriptEntity {
    private output = true;
   
    protected constructor(name: string, type: ExecutableType, body: any) {
        super(name, type as string, body);
    }

    setOutput(output: boolean): Executable  {
        this.output = output;
        return this;
    }

    isOutput(): boolean {
        return this.output;
    }

    static createRunFileParams(path: string) : any {
		return {"path": path};
	}
}

/**
 * Base class of the database executable body.
 */
export abstract class ExecutableDatabaseBody {
    protected constructor(private collection: string) {
        if (!this.collection)
            throw new InvalidParameterException('Invalid collection');
    }

    getCollection(): string {
        return this.collection;
    }
}

/**
 * Base class of the files executable body.
 */
export class ExecutableFileBody {
    private path: string;

    constructor() {
        this.path = "$params.path";
    }
}
