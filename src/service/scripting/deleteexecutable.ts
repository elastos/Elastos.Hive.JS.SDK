import {Executable, ExecutableDatabaseBody, ExecutableType} from "./executable";
import {InvalidParameterException} from "../../exceptions";

export class DeleteExecutableBody extends ExecutableDatabaseBody {
    constructor(collection: string, private filter: any) {
        super(collection);

        if (!this.filter)
            throw new InvalidParameterException('Invalid filter');
    }

    getFilter(): any {
        return this.filter;
    }
}

/**
 * The delete executable can be used to delete documents.
 */
export class DeleteExecutable extends Executable {
    constructor(name: string, collection: string, filter: any) {
        super(name, ExecutableType.DELETE, new DeleteExecutableBody(collection, filter));
    }
}
