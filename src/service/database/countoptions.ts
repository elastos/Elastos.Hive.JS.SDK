/**
 * The options for the counting operation.
 */
export class CountOptions {
	private skip: number;
	private limit: number;
	private maxTimeMS: number;

	setSkip(skip: number): CountOptions {
	    this.skip = skip;
	    return this;
    }

    setLimit(limit: number): CountOptions {
        this.limit = limit;
        return this;
    }

    setMaxTimeMS(milliseconds: number): CountOptions {
        this.maxTimeMS = milliseconds;
        return this;
    }

    getSkip(): number {
	    return this.skip;
    }

    getLimit(): number {
        return this.limit;
    }

    getMaxTimeMS(): number {
        return this.maxTimeMS;
    }
}
