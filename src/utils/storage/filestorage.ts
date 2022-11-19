import { File } from './file';
import { DataStorage } from './datastorage';
import { SHA256 } from '../sha256';
import { Logger } from '../logger';

export class FileStorage implements DataStorage {
	private static LOG = new Logger("FileStorage");

	private static BACKUP = "credential-backup";
	private static TOKENS = "tokens";

	private readonly basePath: string;

	constructor(rootPath: string, userDid: string) {
		let path = rootPath;
		if (!path.endsWith(File.SEPARATOR))
		    path += File.SEPARATOR;

        path += this.compatDid(userDid);
        if (!this.isOnBrowser()) this.createDirectory(path);
		this.basePath = path;
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

    private isOnBrowser() {
        return typeof window !== 'undefined';
    }

    // browser side
    private getLocalStorage() {
        return window.localStorage;
    }

    private getFs() {
	    return require('fs');
    }

    // node side
    private createDirectory(path: string) {
        if (!this.getFs().existsSync(path)) {
            let completion = path.startsWith(File.SEPARATOR) ? File.SEPARATOR : "";
            for (const dir of path.split(File.SEPARATOR)) {
                if (!dir) continue;

                completion = completion + dir + File.SEPARATOR;
                if (!this.getFs().existsSync(completion)) {
                    this.getFs().mkdirSync(completion);
                }
            }
        }
    }

	private readContent(path: string): string {
		if (!path)
			return null;

		if (this.isOnBrowser()) {
            return this.getLocalStorage().getItem(path);
        }

		if (!this.getFs().existsSync(path))
			return null;

		try {
            return this.getFs().readFileSync(path, { encoding: "utf-8" });
		} catch (e) {
            FileStorage.LOG.error(`read content error: ${e.message}`);
			return null;
		}
	}

	private writeContent(path: string, content: string): void {
		if (!path)
			return;

		if (this.isOnBrowser()) {
            this.getLocalStorage().setItem(path, content);
            return;
        }

		const parentPath = path.substring(0, path.lastIndexOf(File.SEPARATOR));
        this.createDirectory(parentPath);

		try {
            this.getFs().writeFileSync(path, content, { encoding: "utf-8" });
		} catch (e) {
			FileStorage.LOG.error(`write content error: ${e.message}`);
		}
	}

	private deleteContent(path: string): void {
		if (!path)
			return;

        if (this.isOnBrowser()) {
            this.getLocalStorage().removeItem(path);
            return;
        }

		try {
            if (this.getFs().existsSync(path))
                this.getFs().unlinkSync(path);
		} catch (e) {
			FileStorage.LOG.error(e.message);
		}
	}

	private makeFullPath(segPath: string, fileName: string): string {
		return this.basePath + segPath + File.SEPARATOR + fileName;
	}

	private compatDid(did: string): string {
		let parts: Array<string> = did.split(":");
		return parts.length >= 3 ? parts[2] : did;
	}
}
