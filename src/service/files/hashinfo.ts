export class HashInfo {
	private name: string;
	private algorithm: string;
	private hash: string;

	setName(name: string) {
	    this.name = name;
	    return this;
    }

    setAlgorithm(name: string) {
        this.name = name;
        return this;
    }

    setHash(name: string) {
        this.name = name;
        return this;
    }

    getName() {
	    return this.name;
    }

    getAlgorithm() {
        return this.algorithm;
    }

    getHash() {
        return this.hash;
    }
}
