/**
 * The class to represent the information of File or Folder.
 */
export class FileInfo {
	private name: string;
	private is_file: boolean;
	private size: number;
	private created: number;
	private updated: number;

	public setName(name: string): void {
		this.name = name;
	}

	public setAsFile(file: boolean): void {
		this.is_file = file;
	}

	public setSize(size: number): void {
		this.size = size;
	}

	public setCreated(created: number): void {
		this.created = created;
	}

	public setUpdated(updated: number): void {
		this.updated = updated;
	}

	public getName(): string {
		return this.name;
	}

	public isFile(): boolean {
		return this.is_file;
	}

	public getSize(): number {
		return this.size;
	}

	public getCreated(): Date {
		return new Date(this.created * 1000);
	}

	public getUpdated(): Date {
		return new Date(this.updated * 1000);
	}
}
