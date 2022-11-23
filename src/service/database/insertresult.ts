export class InsertResult {
    private acknowledged: boolean;
    private insertedIds: string[];

    setAcknowledge(isAcknowledge: boolean) {
        this.acknowledged = isAcknowledge;
        return this;
    }

    setInsertedIds(insertedIds: string[]) {
        this.insertedIds = insertedIds;
        return this;
    }

    isAcknowledge(): boolean {
        return this.acknowledged;
    }

    getInsertedIds(): string[] {
        return this.insertedIds;
    }
}
