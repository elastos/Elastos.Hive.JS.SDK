
export class SortItem {
    public static ASCENDING = 1;
    public static DESCENDING = -1;

    public key: string;
    public order: number;

    public constuctor(key?: string, order?: number) {
        this.key = key;
        this.order = order;
    }
}
