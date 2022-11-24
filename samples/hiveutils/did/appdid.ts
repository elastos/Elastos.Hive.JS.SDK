import { VerifiableCredential, VerifiablePresentation, DIDDocument, JWTHeader, VerificationEventListener } from "@elastosfoundation/did-js-sdk";
import dayjs from "dayjs";
import { DIDEntity } from "./didentity";

export class AppDID extends DIDEntity {
	public static APP_DID = "appId";
	public static APP_DID2 = "appDID2";

	public constructor(name: string, mnemonic: string, phrasepass: string, storepass: string, did: string) {
		super(name, mnemonic, phrasepass, storepass, did);
	}

	public static async create(name: string, mnemonic: string, phrasepass: string, storepass: string,
							   resolver: string, storeRoot: string, did?: string): Promise<AppDID> {
        let newInstance = new AppDID(name, mnemonic, phrasepass, storepass, did);
		await newInstance.initDid(mnemonic, false, storeRoot);
        return newInstance;
    }

	public getAppDid(): string {
		return AppDID.APP_DID;
	}

	public async createPresentation(vc: VerifiableCredential, realm: string, nonce: string): Promise<VerifiablePresentation> {
		let vpb = await VerifiablePresentation.createFor(this.getDid(), null, this.getDIDStore());
		let vp = await vpb.credentials(vc)
				.realm(realm)
				.nonce(nonce)
				.seal(this.getStorePassword());

		AppDID.LOG.info("VerifiablePresentation:{}", vp.toString());

		let listener = VerificationEventListener.getDefaultWithIdent("isValid");
		AppDID.LOG.trace("VerifiablePresentation is Valid :{}", await vp.isValid(listener));
		AppDID.LOG.trace("Listener :{}", listener.toString());

		return vp;
	}

	public async createToken(vp: VerifiablePresentation, hiveDid: string): Promise<string> {
        let cal = dayjs();
        let iat = cal.unix();
        let nbf = cal.unix();
        let exp = cal.add(3, 'month').unix();

		// Create JWT token with presentation.
		let doc: DIDDocument = await this.getDocument();
		let token = await doc.jwtBuilder()
				.addHeader(JWTHeader.TYPE, JWTHeader.JWT_TYPE)
				.addHeader("version", "1.0")
				.setSubject("DIDAuthResponse")
				.setAudience(hiveDid)
				.setIssuedAt(iat)
				.setExpiration(exp)
				.setNotBefore(nbf)
				.claimsWithJson("presentation", vp.toString(true))
				.sign(this.storepass);

		AppDID.LOG.info("JWT Token: {}", token);
		return token;
	}
}
