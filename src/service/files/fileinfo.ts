/**
 * The class to represent the information of File or Folder.
 */
export class FileInfo {
	private name: string;
	private is_file: boolean;
	private size: number;
	private created: number;
	private updated: number;

	public setName(name: string): FileInfo {
		this.name = name;
		return this;
	}

	public setAsFile(file: boolean): FileInfo {
		this.is_file = file;
		return this;
	}

	public setSize(size: number): FileInfo {
		this.size = size;
		return this;
	}

	public setCreated(created: number): FileInfo {
		this.created = created;
		return this;
	}

	public setUpdated(updated: number): FileInfo {
		this.updated = updated;
		return this;
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
