export class UpdateResult {
	private acknowledged: boolean;
	private matchedCount: number;
	private modifiedCount: number;
	private upsertedId: string;

	setAcknowledged(acknowledged: boolean) {
		this.acknowledged = acknowledged;
		return this;
	}

	setMatchedCount(matchedCount: number) {
		this.matchedCount = matchedCount;
        return this;
	}

	setModifiedCount(modifiedCount: number) {
		this.modifiedCount = modifiedCount;
        return this;
	}

	setUpsertedId(upsertedId: string) {
		this.upsertedId = upsertedId;
        return this;
	}

	isAcknowledged(): boolean {
		return this.acknowledged;
	}

	getMatchedCount(): number {
		return this.matchedCount;
	}

	getModifiedCount(): number {
		return this.modifiedCount;
	}

	getUpsertedId(): string {
		return this.upsertedId;
	}
}
