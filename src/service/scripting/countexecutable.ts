import {Executable} from "./executable";
import {ExecutableDatabaseBody, ExecutableType} from "./executable";

export class CountExecutableBody extends ExecutableDatabaseBody {
    private filter: any;
    private options: any;

    constructor(collection:string, filter: any, options: any) {
        super(collection);
        this.filter = filter;
        this.options = options ? options : undefined;
    }
}

export class CountExecutable extends Executable {
	constructor( name: string,  collectionName: string,  filter: any,  options?: any) {
		super(name, ExecutableType.COUNT, null);
		super.setBody(new CountExecutableBody(collectionName, filter, options));
    }
}
