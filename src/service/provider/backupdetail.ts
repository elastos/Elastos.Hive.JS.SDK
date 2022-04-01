export class BackupDetail {
	private pricing_using: string;
	private max_storage: number;
	private use_storage: number;
	private user_did: string;

	public getPricingName() {
		return this.pricing_using;
	}

	public setPricingName(pricingName) {
		this.pricing_using = pricingName;
	}

	public getMaxStorage() {
		return this.max_storage;
	}

	public setMaxStorage(maxStorage) {
		this.max_storage = maxStorage;
	}

	public getUseStorage() {
		return this.use_storage;
	}

	public setUseStorage(useStorage) {
		this.use_storage = useStorage;
	}

	public getUserDid() {
		return this.user_did;
	}

	public setUserDid(userDid) {
		this.user_did = userDid;
	}
}
