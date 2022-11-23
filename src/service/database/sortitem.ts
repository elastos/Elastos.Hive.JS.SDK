export class SortItem {
    static ASCENDING = 1;
    static DESCENDING = -1;

    key: string;
    order: number;

    constructor(key?: string, order?: number) {
        this.key = key;
        this.order = order;
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
