package org.elastos.hive.did;

import org.elastos.did.Issuer;
import org.elastos.did.VerifiableCredential;
import org.elastos.did.exception.DIDException;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

public class UserDID extends DIDEntity {
	private Issuer issuer;

	public UserDID(String name, String mnemonic, String phrasepass, String storepass) throws DIDException {
		super(name, mnemonic, phrasepass, storepass);
		issuer = new Issuer(getDocument());
	}

	public VerifiableCredential issueDiplomaFor(AppDID appInstanceDid) throws DIDException {
		Map<String, Object> subject = new HashMap<>();
		subject.put("appDid", appInstanceDid.getAppDid());

		Calendar exp = Calendar.getInstance();
		exp.add(Calendar.YEAR, 5);

		VerifiableCredential.Builder cb = issuer.issueFor(appInstanceDid.getDid());
		VerifiableCredential vc = cb.id("didapp")
				.type("AppIdCredential")
				.properties(subject)
				.expirationDate(exp.getTime())
				.seal(getStorePassword());

		System.out.println("VerifiableCredential:");
		String vcStr = vc.toString();
		System.out.println(vcStr);

		return vc;
	}

	public VerifiableCredential issueBackupDiplomaFor(String sourceDID, String targetHost, String targetDID) throws DIDException {
		Map<String, Object> subject = new HashMap<>();
		subject.put("sourceDID", sourceDID);
		subject.put("targetHost", targetHost);
		subject.put("targetDID", targetDID);

		Calendar exp = Calendar.getInstance();
		exp.add(Calendar.YEAR, 5);

		VerifiableCredential.Builder cb = issuer.issueFor(sourceDID);
		VerifiableCredential vc = cb.id("backupId")
				.type("BackupCredential")
				.properties(subject)
				.expirationDate(exp.getTime())
				.seal(getStorePassword());

		System.out.println("BackupCredential:");
		String vcStr = vc.toString();
		System.out.println(vcStr);

		return vc;
	}
}
