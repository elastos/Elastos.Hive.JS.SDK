import { VerifiableCredential, VerifiablePresentation, DIDDocument, JWTHeader, DefaultDIDAdapter, DIDBackend, VerificationEventListener } from "@elastosfoundation/did-js-sdk";
import dayjs from "dayjs";
import { DIDEntity } from "./didentity";
import {DID} from '@elastosfoundation/elastos-connectivity-sdk-js';

export class AppDID extends DIDEntity {
	public static APP_DID = "did:elastos:ic8pRXyAT3JqEXo4PzHQHv5rsoYyEyDwpB";
	public static APP_DID2 = "appDID2";

	public constructor(name: string, mnemonic: string, phrasepass: string, storepass: string, did: string) {
		super(name, mnemonic, phrasepass, storepass, did);
	}

	public static async create(name: string, mnemonic: string, phrasepass: string, storepass: string,
							   resolver: string, did?: string): Promise<AppDID> {
    console.log('AppDID.create: before DIDBackend.initialize');
		  // TODO: should not call this again because of AppContext.setupResolver(), check this with did js sdk.
		  DIDBackend.initialize(new DefaultDIDAdapter(resolver));
    console.log('AppDID.create: before new AppDID');
		  let newInstance = new AppDID(name, mnemonic, phrasepass, storepass, did);
    console.log('AppDID.create: before newInstance.initDid');
		  await newInstance.initDid(mnemonic, false);
    console.log('AppDID.create: before return');
		  return newInstance;
    }

	public getAppDid(): string {
		return this.getDid().toString();
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

  static async getAppInstanceDIDDoc(): Promise<DIDDocument> {
    let access = new DID.DIDAccess();
    let info = await access.getOrCreateAppInstanceDID();
    return await info.didStore.loadDid(info.did);
  }

  static async createVerifiablePresentation(
    vc: VerifiableCredential, hiveDid: string, nonce: string, storepass: string):
    Promise<VerifiablePresentation> {
    let access = new DID.DIDAccess();
    let info = await access.getOrCreateAppInstanceDID();
    let vpb = await VerifiablePresentation.createFor(info.did, null, info.didStore);
    let vp = await vpb.credentials(vc).realm(hiveDid).nonce(nonce).seal(storepass);
    let listener = VerificationEventListener.getDefaultWithIdent("isValid");
    return vp;
  }

  static async createChallengeResponse(vp: VerifiablePresentation, hiveDid: string, storepass: string): Promise<string> {
    let cal = dayjs();
    let iat = cal.unix();
    let nbf = cal.unix();
    let exp = cal.add(3, 'month').unix();

    // Create JWT token with presentation.
    let doc: DIDDocument = await AppDID.getAppInstanceDIDDoc();
    let token = await doc.jwtBuilder().addHeader(JWTHeader.TYPE, JWTHeader.JWT_TYPE)
      .addHeader("version", "1.0")
      .setSubject("DIDAuthResponse")
      .setAudience(hiveDid)
      .setIssuedAt(iat)
      .setExpiration(exp)
      .setNotBefore(nbf)
      .claimsWithJson("presentation", vp.toString(true))
      .sign(storepass);

    // AppDID.LOG.info("JWT Token: {}", token);
    return token;
  }
}
