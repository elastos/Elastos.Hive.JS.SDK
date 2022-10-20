import { DataStorage } from './datastorage'
import { SHA256 } from '../sha256'
import { Logger } from '../logger';

/**
 * Based on IndexedDB instead of simulator file system.
 */
export class IndexedDBStorage implements DataStorage {
	private static LOG = new Logger("IndexedDBStorage");

	private static BACKUP = "credential-backup";
	private static TOKENS = "tokens";

	constructor(private userDid: string) {}

	async loadBackupCredential(serviceDid: string): Promise<string> {
		return await this.readContent(this.makeStorageKey(IndexedDBStorage.BACKUP, serviceDid));
	}

	async loadAccessToken(serviceDid: string): Promise<string> {
		return await this.readContent(this.makeStorageKey(IndexedDBStorage.TOKENS, serviceDid));
	}

	async loadAccessTokenByAddress(providerAddress: string): Promise<string> {
		return await this.readContent(this.makeStorageKey(IndexedDBStorage.TOKENS, SHA256.encodeToString(Buffer.from(providerAddress))));
	}

    async storeBackupCredential(serviceDid: string, credential: string): Promise<void> {
		await this.writeContent(this.makeStorageKey(IndexedDBStorage.BACKUP, serviceDid), credential);
	}

    async storeAccessToken(serviceDid: string, accessToken: string): Promise<void> {
        await this.writeContent(this.makeStorageKey(IndexedDBStorage.TOKENS, serviceDid), accessToken);
	}

    async storeAccessTokenByAddress(providerAddress: string, accessToken: string): Promise<void> {
        await this.writeContent(this.makeStorageKey(IndexedDBStorage.TOKENS, SHA256.encodeToString(Buffer.from(providerAddress))), accessToken);
	}

    async clearBackupCredential(serviceDid: string): Promise<void> {
        await this.deleteContent(this.makeStorageKey(IndexedDBStorage.BACKUP, serviceDid));
	}

    async clearAccessToken(serviceDid: string): Promise<void> {
        await this.deleteContent(this.makeStorageKey(IndexedDBStorage.TOKENS, serviceDid));
	}

    async clearAccessTokenByAddress(providerAddress: string): Promise<void> {
        await this.deleteContent(this.makeStorageKey(IndexedDBStorage.TOKENS, SHA256.encodeToString(Buffer.from(providerAddress))));
	}

	private getDatabaseStore(): Promise<any> {
	    return new Promise<any>(((resolve, reject) => {
            // @ts-ignore
            const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
            const open = indexedDB.open("MyDatabase", 1);

            open.onerror = (event) => {
                const msg = `Database error: ${event.target.errorCode}`;
                IndexedDBStorage.LOG.error(msg);
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

                resolve(store);
            }
        }));
    }

	private async readContent(path: string): Promise<string> {
        const store = await this.getDatabaseStore();
        return new Promise(((resolve, reject) => {
            const get = store.get(path);
            get.onsuccess = () => {
                if (!get.result || !get.result.key)
                    resolve(null);
                else
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
