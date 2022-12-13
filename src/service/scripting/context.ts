/**
 * The context is for running scripts with target user did and application did.
 */
export class Context {
	private target_did: string;
	private target_app_did: string;

	setTargetDid(targetDid: string): Context {
		this.target_did = targetDid;
		return this;
	}

	setTargetAppDid(targetAppDid: string) : Context{
		this.target_app_did = targetAppDid;
		return this;
	}

	getTargetDid() {
	    return this.target_did;
    }

    getTargetAppDid() {
	    return this.target_app_did;
    }
}
