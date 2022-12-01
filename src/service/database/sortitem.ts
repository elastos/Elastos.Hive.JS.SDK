/**
 * Sort item for the querying sort option.
 */
export abstract class SortItem {
    static ASCENDING = 1;
    static DESCENDING = -1;

    protected constructor(private key: string, private order: number) {}

    getKey(): string {
        return this.key;
    }

    getOrder(): number {
        return this.order;
    }
}

export class AscendingSortItem extends SortItem {
    constructor(key: string) {
        super(key, SortItem.ASCENDING);
    }
}

export class DescendingSortItem extends SortItem {
    constructor(key: string) {
        super(key, SortItem.DESCENDING);
    }
}
