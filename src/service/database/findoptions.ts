/**
 * The options for the finding operation.
 */
export class FindOptions {
    private skip: number;
    private limit: number;

    setSkip(skip: number) {
        this.skip = skip
        return this;
    }

    setLimit(limit: number) {
        this.limit = limit
        return this;
    }

    getSkip(): number {
        return this.skip;
    }

    getLimit(): number {
        return this.limit;
    }
}