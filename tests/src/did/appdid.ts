import { VerifiableCredential, VerifiablePresentation, DIDDocument, JWTHeader, DIDBackend, DefaultDIDAdapter } from "@elastosfoundation/did-js-sdk";
import dayjs from "dayjs";
import { TestData } from "../config/testdata";
import { DIDEntity } from "./didentity";

export class AppDID extends DIDEntity {
	private appId = "appId";

	public constructor(name: string, mnemonic: string, phrasepass: string, storepass: string) { // , did: string) {
		super(name, mnemonic, phrasepass, storepass); //, did);
	}

	public static async create(name: string, mnemonic: string, phrasepass: string, storepass: string, did?: string): Promise<AppDID> {
		//DIDBackend.initialize(new DefaultDIDAdapter("mainnet")); 
        let newInstance = new AppDID(name, mnemonic, phrasepass, storepass); //, did);
		await newInstance.initPrivateIdentity(mnemonic);	
		await newInstance.initDid();

        return newInstance;
    }

	public getAppDid(): string {
		return this.appId;
	}

	public async createPresentation(vc: VerifiableCredential, realm: string, nonce: string): Promise<VerifiablePresentation> {

		
		let vpb = await VerifiablePresentation.createFor(this.getDid(), null, this.getDIDStore());
		let vp = await vpb.credentials(vc)
				.realm(realm)
				.nonce(nonce)
				.seal(this.getStorePassword());

		AppDID.LOG.info("VerifiablePresentation:{}", vp.toString());

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
				.claimsWithJson("presentation", vp.toString())
				.sign(this.storepass);

		AppDID.LOG.info("JWT Token: {}", token);
		return token;
	}
}
