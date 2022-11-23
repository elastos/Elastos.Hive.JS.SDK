export class NodeVersion {
	private readonly major: number;
	private readonly minor: number;
	private readonly patch: number;

	constructor(major: number, minor: number, patch: number) {
		this.major = major;
		this.minor = minor;
		this.patch = patch;
	}

	getMajor(): number {
		return this.major;
	}

	getMinor(): number {
		return this.minor;
	}

	getPatch(): number {
		return this.patch;
	}

	toString(): string {
		let version : number[] = [];

		this.major && version.push(this.major);
		this.minor && version.push(this.minor);
		this.patch && version.push(this.patch);

		return version.join(".");
	}
}
