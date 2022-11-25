import {InvalidParameterException} from "../../exceptions";
import {ExecutableDatabaseBody, ExecutableType, Executable} from "./executable";

export class UpdateExecutableBody extends ExecutableDatabaseBody {
    constructor(collection: string, private filter: any, private update: any, private options?: any) {
        super(collection);

        if (!this.filter)
            throw new InvalidParameterException('Invalid filter');

        if (!this.update)
            throw new InvalidParameterException('Invalid update');
    }

    getFilter(): any {
        return this.filter;
    }

    getUpdate(): any {
        return this.update;
    }

    getOptions(): any {
        return this.options;
    }
}

/**
 * Used to update the matched documents.
 */
export class UpdateExecutable extends Executable {
    constructor(name: string, collection: string, filter: any, update: any, options: any) {
        super(name, ExecutableType.UPDATE, new UpdateExecutableBody(collection, filter, update, options));
    }
}
