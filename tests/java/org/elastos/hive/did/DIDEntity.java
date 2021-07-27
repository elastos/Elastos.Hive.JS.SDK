package org.elastos.hive.did;

import org.elastos.did.DID;
import org.elastos.did.DIDDocument;
import org.elastos.did.DIDStore;
import org.elastos.did.RootIdentity;
import org.elastos.did.exception.DIDException;

import java.io.File;
import java.util.List;

class DIDEntity {
	private final String name;
	private final String phrasepass;
	protected final String storepass;

	private RootIdentity identity;
	private DIDStore store;
	private DID did;

	protected DIDEntity(String name, String mnemonic, String phrasepass, String storepass) throws DIDException {
		this.name = name;
		this.phrasepass = phrasepass;
		this.storepass = storepass;

		initPrivateIdentity(mnemonic);
		initDid();
	}

	protected void initPrivateIdentity(String mnemonic) throws DIDException {
		final String storePath = System.getProperty("user.dir") + File.separator + "data/didCache" + File.separator + name;

		store = DIDStore.open(storePath);

		String id = RootIdentity.getId(mnemonic, phrasepass);
		if (store.containsRootIdentity(id))
			return; // Already exists

		this.identity = RootIdentity.create(mnemonic, phrasepass, store, storepass);

		identity.synchronize(0);
	}

	protected void initDid() throws DIDException {
		List<DID> dids = store.listDids();
		if (dids.size() > 0) {
			this.did = dids.get(0);
			return;
		}

		DIDDocument doc = identity.newDid(storepass);
		this.did = doc.getSubject();
		System.out.format("[%s] My new DID created: %s%n", name, did);
	}

	protected DIDStore getDIDStore() {
		return store;
	}

	public DID getDid() {
		return did;
	}

	public DIDDocument getDocument() throws DIDException {
		return store.loadDid(did);
	}

	public String getName() {
		return name;
	}

	protected String getStorePassword() {
		return storepass;
	}

	@Override
	public String toString() {
		return this.did.toString();
	}
}
