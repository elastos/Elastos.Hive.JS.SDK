export class UpdateResult {
	private acknowledged: boolean;
	private matched_count: number;
	private modified_count: number;
	private upserted_id: string;

	public setAcknowledged(acknowledged: boolean): void {
		this.acknowledged = acknowledged;
	}

	public setMatchedCount(matchedCount: number): void {
		this.matched_count = matchedCount;
	}

	public setModifiedCount(modifiedCount: number): void {
		this.modified_count = modifiedCount;
	}

	public setUpsertedId(upsertedId: string): void {
		this.upserted_id = upsertedId;
	}

	public isAcknowledged(): boolean {
		return this.acknowledged;
	}

	public getMatchedCount(): number {
		return this.matched_count;
	}

	public getModifiedCount(): number {
		return this.modified_count;
	}

	public getUpsertedId(): string {
		return this.upserted_id;
	}
}
