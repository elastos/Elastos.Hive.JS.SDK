package org.elastos.hive.did;

import org.elastos.did.VerifiableCredential;
import org.elastos.did.VerifiablePresentation;
import org.elastos.did.exception.DIDException;
import org.elastos.did.jwt.Header;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class AppDID extends DIDEntity {

	private String appId = "appId";

	public AppDID(String name, String mnemonic, String phrasepass, String storepass) throws DIDException {
		super(name, mnemonic, phrasepass, storepass);
	}

	public String getAppDid() {
		return appId;
	}

	public VerifiablePresentation createPresentation(VerifiableCredential vc, String realm, String nonce) throws DIDException {
		VerifiablePresentation.Builder vpb = VerifiablePresentation.createFor(getDid(), getDIDStore());
		List<VerifiableCredential> vcs = new ArrayList<VerifiableCredential>(1);
		vcs.add(vc);

		VerifiablePresentation vp = vpb.credentials(vcs.toArray(new VerifiableCredential[vcs.size()]))
				.realm(realm)
				.nonce(nonce)
				.seal(getStorePassword());

		System.out.println("VerifiablePresentation:");
		String vpStr = vp.toString();
		System.out.println(vpStr);

		return vp;
	}

	public String createToken(VerifiablePresentation vp, String hiveDid) throws DIDException {

		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.MILLISECOND, 0);
		Date iat = cal.getTime();
		Date nbf = cal.getTime();
		cal.add(Calendar.MONTH, 3);
		Date exp = cal.getTime();

		// Create JWT token with presentation.
		String token = getDocument().jwtBuilder()
				.addHeader(Header.TYPE, Header.JWT_TYPE)
				.addHeader("version", "1.0")

				.setSubject("DIDAuthResponse")
				.setAudience(hiveDid)
				.setIssuedAt(iat)
				.setExpiration(exp)
				.setNotBefore(nbf)
				.claimWithJson("presentation", vp.toString())
				.sign(storepass)
				.compact();

		System.out.println("JWT Token:");
		System.out.println("  " + token);
		return token;
	}
}
