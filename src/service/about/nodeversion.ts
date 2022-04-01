export class NodeVersion {
	private major: number;
	private minor: number;
	private patch: number;

	constructor(major: number, minor: number, patch: number) {
		this.major = major;
		this.minor = minor;
		this.patch = patch;
	}

	public getMajor(): number {
		return this.major;
	}

	public getMinor(): number {
		return this.minor;
	}

	public getPatch(): number {
		return this.patch;
	}

	public toString(): string {
		let version : number[] = [];

		this.major && version.push(this.major);
		this.minor && version.push(this.minor);
		this.patch && version.push(this.patch);

		return version.join(".");
	}
}
