/**
 * The detail of the user's vault from the node owner view.
 */
export class VaultDetail {
	private pricing_using: string;
	private max_storage: number;
	private file_use_storage: number;
	private db_use_storage: number;
	private user_did: string;

    setPricingName(pricingName) {
        this.pricing_using = pricingName;
        return this;
    }

    setMaxStorage(maxStorage) {
        this.max_storage = maxStorage;
        return this;
    }

    setFileUseStorage(fileUseStorage) {
        this.file_use_storage = fileUseStorage;
        return this;
    }

    setDatabaseUseStorage(databaseUseStorage) {
        this.db_use_storage = databaseUseStorage;
        return this;
    }

    setUserDid(userDid) {
        this.user_did = userDid;
        return this;
    }

	getPricingName() {
		return this.pricing_using;
	}

	getMaxStorage() {
		return this.max_storage;
	}

	getFileUseStorage() {
		return this.file_use_storage;
	}

	getDatabaseUseStorage() {
		return this.db_use_storage;
	}

	getUserDid() {
		return this.user_did;
	}
}
