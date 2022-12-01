export class UpdateResult {
	private acknowledged: boolean;
	private matched_count: number;
	private modified_count: number;
	private upserted_id: string;

	setAcknowledged(acknowledged: boolean) {
		this.acknowledged = acknowledged;
		return this;
	}

	setMatchedCount(matchedCount: number) {
		this.matched_count = matchedCount;
        return this;
	}

	setModifiedCount(modifiedCount: number) {
		this.modified_count = modifiedCount;
        return this;
	}

	setUpsertedId(upsertedId: string) {
		this.upserted_id = upsertedId;
        return this;
	}

	isAcknowledged(): boolean {
		return this.acknowledged;
	}

	getMatchedCount(): number {
		return this.matched_count;
	}

	getModifiedCount(): number {
		return this.modified_count;
	}

	getUpsertedId(): string {
		return this.upserted_id;
	}
}
