import {Executable, ExecutableDatabaseBody, ExecutableType} from "./executable";

export class DeleteExecutableBody extends ExecutableDatabaseBody {
    private filter: any;

    constructor( collection: string, filter: any) {
        super(collection);
        this.filter = filter;
    }
}

export class DeleteExecutable extends Executable {
    constructor(name: string, collectionName: string, filter: any) {
        super(name, ExecutableType.DELETE, null);
        super.setBody(new DeleteExecutableBody(collectionName, filter));
    }
}
