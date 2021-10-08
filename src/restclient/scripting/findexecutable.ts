import { Executable } from "./executable";
import { ExecutableDatabaseBody, ExecutableType } from "./executable";

export class FindExecutableBody extends ExecutableDatabaseBody {
    private filter: any;
    private options: any;

    constructor(collection:string, filter: any, options: any) {
        super(collection);
        this.filter = filter;
        this.options = options;
    }
}

export class FindExecutable extends Executable {
	constructor( name: string,  collectionName: string,  filter: any,  options: any) {
		super(name, ExecutableType.FIND, null);
		super.setBody(new FindExecutableBody(collectionName, filter, options));
    }
}
