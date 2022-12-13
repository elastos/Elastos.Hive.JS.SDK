import {ExecutableDatabaseBody, ExecutableType, Executable} from "./executable";
import {InvalidParameterException} from "../../exceptions";

export class CountExecutableBody extends ExecutableDatabaseBody {
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
 * The count executable can count the documents under the database collection.
 */
export class CountExecutable extends Executable {
	constructor( name: string,  collection: string,  filter: any,  options?: any) {
		super(name, ExecutableType.COUNT, new CountExecutableBody(collection, filter, options));
    }
}
