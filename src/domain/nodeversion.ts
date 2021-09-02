export class NodeVersion {
	private major: number;
	private minor: number;
	private patch: number;

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
		return String(this.major) + String(this.minor) + String(this.patch);
	}
}
