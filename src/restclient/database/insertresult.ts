export class InsertResult {
    private acknowledged: boolean;
    private inserted_ids: string[];

    public isAcknowledge(): boolean {
        return this.acknowledged;
    }

    public getIntertedIds(): string[] {
        return this.inserted_ids;
    }

    public setAcknowledge(isAcknowledge: boolean): void {
        this.acknowledged = isAcknowledge;
    }

    public setInsertedIds(insertedIds: string[]): void {
        this.inserted_ids = insertedIds;
    }
}