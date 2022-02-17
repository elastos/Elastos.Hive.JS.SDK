import { VerifiableCredential, Issuer, VerifiablePresentation, DIDDocument, JWTHeader, DIDURL } from "@elastosfoundation/did-js-sdk";
import dayjs from "dayjs";
import { AppDID } from "./appdid";
import { DIDEntity } from "./didentity";

export class UserDID extends DIDEntity {
	private issuer: Issuer;

	constructor(name: string, mnemonic: string, phrasepass: string, storepass: string, did?: string) {
		super(name, mnemonic, phrasepass, storepass, did);
	}

    public static async create(name: string, mnemonic: string, phrasepass: string, storepass: string, did?:string): Promise<UserDID> {
        let newInstance = new UserDID(name, mnemonic, phrasepass, storepass, did);
		await newInstance.initPrivateIdentity(mnemonic);	
		await newInstance.initDid();

        let doc = await newInstance.getDocument();
        newInstance.setIssuer(new Issuer(doc));

        return newInstance;
    }

    private setIssuer(issuer: Issuer): void {
        this.issuer = issuer;
    }

	public async issueDiplomaFor(appInstanceDid: AppDID): Promise<VerifiableCredential> {
		
	// 	let issuerObject = new Issuer(userDocument, id);
    // let vcBuilder = new VerifiableCredential.Builder(issuerObject, appDid);
    // let vc = await vcBuilder
    //   .expirationDate(this.getExpirationDate())
    //   .type('AppIdCredential')
    //   .property('appDid', appDid.toString())
    //   .property('appInstanceDid', appDid.toString())
    //   .id(DIDURL.from('#app-id-credential', appDid) as DIDURL)
    //   .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string); // and we sign so it creates a Proof with method and signature

		
		
		let subject = {};

		subject["appDid"] = appInstanceDid.getDid();
		subject["appInstanceDid"] = appInstanceDid.getDid();

        let cal = dayjs();
        cal = cal.add(5, 'year');

		
		let cb = this.issuer.issueFor(appInstanceDid.getDid());
		let vc = await cb.id(DIDURL.from('#app-id-credential', appInstanceDid.getDid()) as DIDURL)
				.type("AppIdCredential")
				.properties(subject)
				.expirationDate(cal.toDate())
				.seal(this.getStorePassword());

		UserDID.LOG.debug("VerifiableCredential: {}", vc.toString());
		UserDID.LOG.trace("VerifiableCredential IsValid: {}", vc.isValid());
		return vc;
	}

	public async issueBackupDiplomaFor(sourceDID: string, targetHost: string, targetDID: string): Promise<VerifiableCredential> {
		let subject = {};
		subject["sourceDID"] = sourceDID;
		subject["targetHost"] = targetHost;
		subject["targetDID"] = targetDID;

        let cal = dayjs();
        cal.add(5, 'year');

		let cb = this.issuer.issueFor(sourceDID);
		let vc = await cb.id("backupId")
				.type("BackupCredential")
				.properties(subject)
				.expirationDate(cal.toDate())
				.seal(this.getStorePassword());

		UserDID.LOG.info("BackupCredential: {}", vc.toString());

		return vc;
	}
}
