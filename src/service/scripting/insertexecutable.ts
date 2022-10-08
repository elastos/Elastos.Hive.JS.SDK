import {Executable} from "./executable";
import {ExecutableDatabaseBody, ExecutableType} from "./executable";

export class InsertExecutableBody extends ExecutableDatabaseBody {
    private document: any;
    private options: any;

    constructor(collection: string, document: any, options: any) {
        super(collection);
        this.document = document;
        this.options = options;
    }
}

export class InsertExecutable extends Executable {
    constructor(name: string, collectionName: string, document: any, options: any) {
        super(name, ExecutableType.INSERT, null);
        super.setBody(new InsertExecutableBody(collectionName, document, options));
    }
}
