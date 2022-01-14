export class VaultDetail {
	private pricing_using: string;
	private max_storage: number;
	private file_use_storage: number;
	private db_use_storage: number;
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

	public getFileUseStorage() {
		return this.file_use_storage;
	}

	public setFileUseStorage(fileUseStorage) {
		this.file_use_storage = fileUseStorage;
	}

	public getDatabaseUseStorage() {
		return this.db_use_storage;
	}

	public setDatabaseUseStorage(databaseUseStorage) {
		this.db_use_storage = databaseUseStorage;
	}

	public getUserDid() {
		return this.user_did;
	}

	public setUserDid(userDid) {
		this.user_did = userDid;
	}
}
