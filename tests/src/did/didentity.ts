import { RootIdentity, DIDStore, DID, DIDDocument } from "@elastosfoundation/did-js-sdk";
import { File, Logger } from "@elastosfoundation/hive-js-sdk";

export class DIDEntity {
    protected static LOG = new Logger("DIDEntity");

	private readonly name: string;
	private readonly phrasepass: string;
	private mnemonic: string
	protected storepass: string;

	private didStore: DIDStore;
	private did: DID;
	private didString: string;

	constructor (name: string, mnemonic: string, phrasepass: string, storepass: string, did?: string) {
		this.name = name;
		this.phrasepass = phrasepass;
		this.storepass = storepass;
		this.didString = did;
		this.mnemonic = mnemonic;
	}

	public async initDid2(mnemonic: string, needResolve: boolean) {
		const path = "data/didCache" + File.SEPARATOR + this.name;
		this.didStore = await DIDStore.open(path);
		const rootIdentity = await this.getRootIdentity(mnemonic);
		await this.initDidByRootIdentity(rootIdentity, needResolve);
	}

	protected async getRootIdentity(mnemonic: string): Promise<RootIdentity> {
		const id = RootIdentity.getIdFromMnemonic(mnemonic, this.phrasepass);
		return this.didStore.containsRootIdentity(id) ? await this.didStore.loadRootIdentity(id)
			: RootIdentity.createFromMnemonic(mnemonic, this.phrasepass, this.didStore, this.storepass);
	}

	protected async initDidByRootIdentity(rootIdentity: RootIdentity, needResolve: boolean): Promise<void> {
		const dids = await this.didStore.listDids();
		if (dids.length > 0) {
			this.did = dids[0];
		} else {
			if (needResolve) {
				const synced = await rootIdentity.synchronizeIndex(0);
				console.info(`${this.name}: identity synchronized result: ${synced}`);
				this.did = rootIdentity.getDid(0);
			} else {
				const doc: DIDDocument = await rootIdentity.newDid(this.storepass);
				this.did = doc.getSubject();
				console.info(`[${this.name}] My new DID created: ${this.did.toString()}`);
			}
		}
		if (!this.did) {
			console.error("Can not get the did from the local store.");
		}
	}

	protected getDIDStore(): DIDStore {
		return this.didStore;
	}

	public getDid(): DID {
		return this.did;
	}

	public async getDocument(): Promise<DIDDocument> {
		return await this.didStore.loadDid(this.did);
	}

	public getName(): string {
		return this.name;
	}

	protected getStorePassword(): string {
		return this.storepass;
	}

	public toString(): string {
		return this.did.toString();
	}
}
