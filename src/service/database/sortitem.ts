export class SortItem {
    public static ASCENDING = 1;
    public static DESCENDING = -1;

    public key: string;
    public order: number;

    public constructor(key?: string, order?: number) {
        this.key = key;
        this.order = order;
    }
}

export class AscendingSortItem extends SortItem {
    public constructor(key: string) {
        super(key, SortItem.ASCENDING);
    }
}

export class DescendingSortItem extends SortItem {
    public constructor(key: string) {
        super(key, SortItem.DESCENDING);
    }
}
