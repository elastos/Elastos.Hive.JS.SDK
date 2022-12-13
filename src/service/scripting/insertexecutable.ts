import {ExecutableDatabaseBody, ExecutableType, Executable} from "./executable";
import {InvalidParameterException} from "../../exceptions";

export class InsertExecutableBody extends ExecutableDatabaseBody {
    constructor(collection: string, private document: any, private options?: any) {
        super(collection);

        if (!this.document)
            throw new InvalidParameterException('Invalid document');
    }

    getDocument(): any {
        return this.document;
    }

    getOptions(): any {
        return this.options;
    }
}

/**
 * Used to insert the documents.
 */
export class InsertExecutable extends Executable {
    constructor(name: string, collection: string, document: any, options: any) {
        super(name, ExecutableType.INSERT, new InsertExecutableBody(collection, document, options));
    }
}
