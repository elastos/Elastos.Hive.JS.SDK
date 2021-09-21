import { RootIdentity, DIDStore, DID, DIDDocument } from "@elastosfoundation/did-js-sdk";
import { File, Logger } from "@dchagastelles/elastos-hive-js-sdk/"

export class DIDEntity {
    protected static LOG = new Logger("DIDEntity");

	private name: string;
	private phrasepass: string;
	protected storepass: string;

	private identity: RootIdentity;
	private store: DIDStore;
	private did: DID;

	constructor (name: string, mnemonic: string, phrasepass: string, storepass: string) {
		this.name = name;
		this.phrasepass = phrasepass;
		this.storepass = storepass;

		void this.initPrivateIdentity(mnemonic).finally(() => { void this.initDid() });
	}

	protected async initPrivateIdentity(mnemonic: string): Promise<void> {
		let storePath = "data/didCache" + File.SEPARATOR + this.name;

		this.store = await DIDStore.open(storePath);

		let id = RootIdentity.getIdFromMnemonic(mnemonic, this.phrasepass);
		if (this.store.containsRootIdentity(id))
			return; // Already exists

		this.identity = RootIdentity.createFromMnemonic(mnemonic, this.phrasepass, this.store, this.storepass);

		await this.identity.synchronize();
	}

	protected async initDid(): Promise<void> {
		let dids = await this.store.listDids();
		if (dids.length > 0) {
			this.did = dids[0];
			return;
		}

		let doc = await this.identity.newDid(this.storepass);
		this.did = doc.getSubject();
		DIDEntity.LOG.info("{} My new DID created: {}", this.name, this.did.toString());
	}

	protected getDIDStore(): DIDStore {
		return this.store;
	}

	public getDid(): DID {
		return this.did;
	}

	public async getDocument(): Promise<DIDDocument> {
		return await this.store.loadDid(this.did);
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
