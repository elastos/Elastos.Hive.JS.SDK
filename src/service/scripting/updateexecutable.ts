import {Executable} from "./executable";
import {ExecutableDatabaseBody, ExecutableType} from "./executable";

export class UpdateExecutable extends Executable {
    constructor(name: string, collectionName: string, filter: any, update: any, options: any) {
        super(name, ExecutableType.UPDATE, null);
        super.setBody(new UpdateExecutableBody(collectionName, filter, update, options));
    }
}

export class UpdateExecutableBody extends ExecutableDatabaseBody {
    private filter: any;
    private update: any;
    private options: any;

    constructor(collection: string, filter: any, update: any, options: any) {
        super(collection);
        this.filter = filter;
        this.update = update;
        this.options = options;
    }
}
