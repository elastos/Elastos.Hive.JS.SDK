import { File } from './file'
import { DataStorage } from './datastorage'
import { SHA256 } from '../sha256'
import { Logger } from '../logger';

export class FileStorage implements DataStorage {
	private static LOG = new Logger("FileStorage");

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

	async loadBackupCredential(serviceDid: string): Promise<string> {
		return await this.readContent(this.makeFullPath(FileStorage.BACKUP, this.compatDid(serviceDid)));
	}

    async loadAccessToken(serviceDid: string): Promise<string> {
		return await this.readContent(this.makeFullPath(FileStorage.TOKENS, this.compatDid(serviceDid)));
	}

    async loadAccessTokenByAddress(providerAddress: string): Promise<string> {
		return await this.readContent(this.makeFullPath(FileStorage.TOKENS, SHA256.encodeToString(Buffer.from(providerAddress))));
	}

    async storeBackupCredential(serviceDid: string, credential: string): Promise<void> {
        await this.writeContent(this.makeFullPath(FileStorage.BACKUP, this.compatDid(serviceDid)), credential);
	}

    async storeAccessToken(serviceDid: string, accessToken: string): Promise<void> {
        await this.writeContent(this.makeFullPath(FileStorage.TOKENS, this.compatDid(serviceDid)), accessToken);
	}

    async storeAccessTokenByAddress(providerAddress: string, accessToken: string): Promise<void> {
        await this.writeContent(this.makeFullPath(FileStorage.TOKENS, SHA256.encodeToString(Buffer.from(providerAddress))), accessToken);
	}

    async clearBackupCredential(serviceDid: string): Promise<void> {
        await this.deleteContent(this.makeFullPath(FileStorage.BACKUP, this.compatDid(serviceDid)));
	}

    async clearAccessToken(serviceDid: string): Promise<void> {
        await this.deleteContent(this.makeFullPath(FileStorage.TOKENS, this.compatDid(serviceDid)));
	}

    async clearAccessTokenByAddress(providerAddress: string): Promise<void> {
        await this.deleteContent(this.makeFullPath(FileStorage.TOKENS, SHA256.encodeToString(Buffer.from(providerAddress))));
	}

	private async readContent(path: string): Promise<string> {
	    return new Promise(resolve => {
            if (path == null)
                resolve(null);

            if (!File.exists(path))
                resolve(null);

            try {
                resolve(new File(path).readText());
            } catch (e) {
                FileStorage.LOG.error(e.message);
                resolve(null);
            }
        });
	}

	private async writeContent(path: string, content: string): Promise<void> {
	    return new Promise(resolve => {
            if (path == null)
                resolve();

            let targetFile: File = new File(path)
            let parent: File = targetFile.getParentDirectory();
            if (!parent.exists())
                parent.createDirectory();

            if (!parent.exists())
                resolve();

            try {
                targetFile.writeText(content);
            } catch (e) {
                FileStorage.LOG.error(e.message);
            }
            resolve();
        });
	}

	private async deleteContent(path: string): Promise<void> {
	    return new Promise(resolve => {
            if (path == null)
                resolve();

            try {
                new File(path).delete();
            } catch (e) {
                FileStorage.LOG.error(e.message);
            }
            resolve();
        });
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
