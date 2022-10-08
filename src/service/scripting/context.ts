export class Context {
	private target_did: string;
	private target_app_did: string;

	public setTargetDid( targetDid: string): Context {
		this.target_did = targetDid;
		return this;
	}

	public  setTargetAppDid( targetAppDid: string) : Context{
		this.target_app_did = targetAppDid;
		return this;
	}
}
