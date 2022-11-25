/**
 * The detail about the backup service on the backup node.
 */
export class BackupDetail {
	private pricing_using: string;
	private max_storage: number;
	private use_storage: number;
	private user_did: string;

    setPricingName(pricingName) {
        this.pricing_using = pricingName;
        return this;
    }

    setMaxStorage(maxStorage) {
        this.max_storage = maxStorage;
        return this;
    }

    setUseStorage(useStorage) {
        this.use_storage = useStorage;
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

	getUseStorage() {
		return this.use_storage;
	}

	getUserDid() {
		return this.user_did;
	}
}
