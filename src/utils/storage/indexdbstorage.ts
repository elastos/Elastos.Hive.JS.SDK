import { DataStorage } from './datastorage'
import { SHA256 } from '../sha256'
import { Logger } from '../logger';

/**
 * Based on IndexedDB instead of simulator file system.
 */
export class FileStorage implements DataStorage {
	private static LOG = new Logger("FileStorage");

	private static BACKUP = "credential-backup";
	private static TOKENS = "tokens";

	private store;

	constructor(rootPath: string, private userDid: string) {}

	async loadBackupCredential(serviceDid: string): Promise<string> {
		return await this.readContent(this.makeStorageKey(FileStorage.BACKUP, serviceDid));
	}

	async loadAccessToken(serviceDid: string): Promise<string> {
		return await this.readContent(this.makeStorageKey(FileStorage.TOKENS, serviceDid));
	}

	async loadAccessTokenByAddress(providerAddress: string): Promise<string> {
		return await this.readContent(this.makeStorageKey(FileStorage.TOKENS, SHA256.encodeToString(Buffer.from(providerAddress))));
	}

    async storeBackupCredential(serviceDid: string, credential: string): Promise<void> {
		await this.writeContent(this.makeStorageKey(FileStorage.BACKUP, serviceDid), credential);
	}

    async storeAccessToken(serviceDid: string, accessToken: string): Promise<void> {
        await this.writeContent(this.makeStorageKey(FileStorage.TOKENS, serviceDid), accessToken);
	}

    async storeAccessTokenByAddress(providerAddress: string, accessToken: string): Promise<void> {
        await this.writeContent(this.makeStorageKey(FileStorage.TOKENS, SHA256.encodeToString(Buffer.from(providerAddress))), accessToken);
	}

    async clearBackupCredential(serviceDid: string): Promise<void> {
        await this.deleteContent(this.makeStorageKey(FileStorage.BACKUP, serviceDid));
	}

    async clearAccessToken(serviceDid: string): Promise<void> {
        await this.deleteContent(this.makeStorageKey(FileStorage.TOKENS, serviceDid));
	}

    async clearAccessTokenByAddress(providerAddress: string): Promise<void> {
        await this.deleteContent(this.makeStorageKey(FileStorage.TOKENS, SHA256.encodeToString(Buffer.from(providerAddress))));
	}

	private getDatabaseStore(): Promise<any> {
	    let _this = this;
	    return new Promise<any>(((resolve, reject) => {
	        if (!_this.store) {
                // @ts-ignore
                const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
                const open = indexedDB.open("MyDatabase", 1);

                open.onerror = (event) => {
                    const msg = `Database error: ${event.target.errorCode}`;
                    FileStorage.LOG.error(msg);
                    reject(Error(msg));
                };

                open.onupgradeneeded = () => {
                    // INFO: triggered before "onsuccess"
                    const db = open.result;
                    const store = db.createObjectStore("MyObjectStore", {keyPath: "key"});
                    const index = store.createIndex("NameIndex", ["key"]);
                };

                open.onsuccess = () => {
                    const db = open.result;
                    const tx = db.transaction("MyObjectStore", "readwrite");
                    const store = tx.objectStore("MyObjectStore");
                    const index = store.index("NameIndex");

                    tx.oncomplete = function() {
                        db.close();
                    };

                    _this.store = store;
                    resolve(store);
                }
            } else {
                resolve(this.store);
            }
        }));
    }

	private async readContent(path: string): Promise<string> {
        const store = await this.getDatabaseStore();
        return new Promise(((resolve, reject) => {
            const get = store.get(path);
            get.onsuccess = () => {
                resolve(get.result.key);
            };
            get.onerror = () => {
                reject(Error('Failed to get the value.'));
            };
        }));
	}

	private async writeContent(path: string, content: string): Promise<void> {
        const store = await this.getDatabaseStore();
        store.put({key: path, value: content});
	}

	private async deleteContent(path: string): Promise<void> {
        const store = await this.getDatabaseStore();
        return new Promise(((resolve, reject) => {
            const get = store.delete(path);
            get.onsuccess = () => {
                resolve();
            };
            get.onerror = () => {
                reject(Error('Failed to get the value.'));
            };
        }));
	}

    private makeStorageKey(segPath: string, fileName: string): string {
        return `${this.userDid}-${segPath}::${fileName}`;
    }
}
