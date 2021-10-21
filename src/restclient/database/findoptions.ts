export class FindOptions {
    skip: number;
    limit: number;

    constructor(){
        this.limit = 0;
        this.skip = 0;
    }

	getSkip() : number {
		return this.skip;
	}

	getLimit(): number {
		return this.limit;
    }
    
    setSkip(skip: number) : FindOptions {
        this.skip = skip;
        return this;
	}

	setLimit(limit: number) : FindOptions {
        this.limit = limit;
        return this;
	}
}



// package org.elastos.hive.vault.database;

// public class FindOptions {
// 	private Integer skip;
// 	private Integer limit;

// 	public FindOptions setSkip(Integer skip) {
// 		this.skip = skip;
// 		return this;
// 	}

// 	public FindOptions setLimit(Integer limit) {
// 		this.limit = limit;
// 		return this;
// 	}

// 	public Integer getSkip() {
// 		return skip;
// 	}

// 	public String getSkipStr() {
// 		return skip != null ? String.valueOf(skip) : "";
// 	}

// 	public Integer getLimit() {
// 		return limit;
// 	}

// 	public String getLimitStr() {
// 		return limit != null ? String.valueOf(limit) : "";
// 	}
// }
