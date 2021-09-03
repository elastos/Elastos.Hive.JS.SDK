import { Condition } from "./condition";
import { Executable } from "./executable";

export class RegScriptParams {
	private executable: Executable;
	private allowAnonymousUser: Boolean;
	private allowAnonymousApp: Boolean;
	private condition: Condition;

	setExecutable(executable: Executable) : RegScriptParams {
		this.executable = executable;
		return this;
	}

	setAllowAnonymousUser(allowAnonymousUser: boolean) : RegScriptParams{
		this.allowAnonymousUser = allowAnonymousUser;
		return this;
	}

	setAllowAnonymousApp(allowAnonymousApp:boolean) : RegScriptParams{
		this.allowAnonymousApp = allowAnonymousApp;
		return this;
	}

	setCondition( condition: Condition) : RegScriptParams{
		this.condition = condition;
		return this;
	}

	toString() : string {
		return JSON.stringify(this);
	}
}
