import { File } from './file'
import { DataStorage } from './datastorage'
import { SHA256 } from './sha256'
import { BASE64 } from './base64'

export class FileStorage implements DataStorage {
	private static BACKUP = "credential-backup";
	private static TOKENS = "tokens";

	private basePath: string;

	constructor(rootPath: string, userDid: string) {
		let path = rootPath;
		if (!path.endsWith(File.SEPARATOR))
			path += File.SEPARATOR;

		path += this.compatDid(userDid);
		this.basePath = path;

		let file = new File(path);
		if (!file.exists())
			file.createDirectory();
	}

	public loadBackupCredential(serviceDid: string): string {
		return this.readContent(this.makeFullPath(FileStorage.BACKUP, this.compatDid(serviceDid)));
	}

	public loadAccessToken(serviceDid: string): string {
		return this.readContent(this.makeFullPath(FileStorage.TOKENS, this.compatDid(serviceDid)));
	}

	public loadAccessTokenByAddress(providerAddress: string): string {
		return this.readContent(this.makeFullPath(FileStorage.TOKENS, SHA256.encodeToString(Buffer.from(providerAddress))));
	}

	public storeBackupCredential(serviceDid: string, credential: string): void {
		this.writeContent(this.makeFullPath(FileStorage.BACKUP, this.compatDid(serviceDid)), credential);
	}

	public storeAccessToken(serviceDid: string, accessToken: string): void {
		this.writeContent(this.makeFullPath(FileStorage.TOKENS, this.compatDid(serviceDid)), accessToken);
	}

	public storeAccessTokenByAddress(providerAddress: string, accessToken: string): void {
		this.writeContent(this.makeFullPath(FileStorage.TOKENS, SHA256.encodeToString(Buffer.from(providerAddress))), accessToken);
	}

	public clearBackupCredential(serviceDid: string): void {
		this.deleteContent(this.makeFullPath(FileStorage.BACKUP, this.compatDid(serviceDid)));
	}

	public clearAccessToken(serviceDid: string): void {
		this.deleteContent(this.makeFullPath(FileStorage.TOKENS, this.compatDid(serviceDid)));
	}

	public clearAccessTokenByAddress(providerAddress: string): void {
		this.deleteContent(this.makeFullPath(FileStorage.TOKENS, SHA256.encodeToString(Buffer.from(providerAddress))));
	}

	private readContent(path: string): string {
		if (path == null)
			return null;

		if (!File.exists(path))
			return null;

		try {
			return new File(path).readText();
		} catch (e) {
            console.log(e.message);
			return null;
		}
	}

	private writeContent(path: string, content: string): void {
		if (path == null)
			return;

        let targetFile: File = new File(path)
		let parent: File = targetFile.getParentDirectory();
		if (!parent.exists())
			parent.createDirectory();

		if (!parent.exists())
			return;

		try {
            targetFile.writeText(content);
		} catch (e) {
			console.log(e.message);
		}
	}

	private deleteContent(path: string): void {
		if (path == null)
			return;

		try {
            (new File(path)).delete();
		} catch (e) {
			console.log(e.message);
		}
	}

	private makeFullPath(segPath: string, fileName: string): string {
		return this.basePath
					+ File.SEPARATOR
					+ segPath
					+ File.SEPARATOR
					+ fileName;
	}

	private compatDid(did: string): string {
		let parts: Array<string> = did.split(":");
		return parts.length >= 3 ? parts[2] : did;
	}
}
