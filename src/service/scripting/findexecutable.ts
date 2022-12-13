import {InvalidParameterException} from "../../exceptions";
import {ExecutableDatabaseBody, ExecutableType, Executable} from "./executable";

export class FindExecutableBody extends ExecutableDatabaseBody {
    constructor(collection: string, private filter: any, private options?: any) {
        super(collection);

        if (!this.filter)
            throw new InvalidParameterException('Invalid filter');
    }

    getFilter(): any {
        return this.filter;
    }

    getOptions(): any {
        return this.options;
    }
}

/**
 * Used to find the matched documents.
 */
export class FindExecutable extends Executable {
    constructor(name: string, collection: string, filter: any, options?: any) {
        super(name, ExecutableType.FIND, new FindExecutableBody(collection, filter, options));
    }
}
