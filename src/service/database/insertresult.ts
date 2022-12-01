export class InsertResult {
    private acknowledged: boolean;
    private inserted_ids: string[];

    setAcknowledge(isAcknowledge: boolean) {
        this.acknowledged = isAcknowledge;
        return this;
    }

    setInsertedIds(insertedIds: string[]) {
        this.inserted_ids = insertedIds;
        return this;
    }

    isAcknowledge(): boolean {
        return this.acknowledged;
    }

    getInsertedIds(): string[] {
        return this.inserted_ids;
    }
}
