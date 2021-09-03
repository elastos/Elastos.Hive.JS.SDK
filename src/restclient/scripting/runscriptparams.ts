import { Context } from "./context";

export class RunScriptParams {
	private context: Context;
	private params: Object;

	setContext( context: Context): RunScriptParams {
		this.context = context;
		return this;
	}

	setParams( params: object) : RunScriptParams {
		this.params = params;
		return this;
    }
    
    toString() : string {
        return JSON.stringify(this);
    }
}
