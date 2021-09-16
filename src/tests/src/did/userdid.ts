import { is } from "@babel/types";
import { VerifiableCredential, Issuer, VerifiablePresentation, DIDDocument, JWTHeader } from "@elastosfoundation/did-js-sdk";
import dayjs from "dayjs";
import { AppDID } from "./appdid";
import { DIDEntity } from "./didentity";

export class UserDID extends DIDEntity {
	private issuer: Issuer;

	constructor(name: string, mnemonic: string, phrasepass: string, storepass: string) {
		super(name, mnemonic, phrasepass, storepass);
	}

    public static async create(name: string, mnemonic: string, phrasepass: string, storepass: string): Promise<UserDID> {
        let newInstance = new UserDID(name, mnemonic, phrasepass, storepass);

        let doc = await newInstance.getDocument();
        newInstance.setIssuer(new Issuer(doc));

        return newInstance;
    }

    private setIssuer(issuer: Issuer): void {
        this.issuer = issuer;
    }

	public async issueDiplomaFor(appInstanceDid: AppDID): Promise<VerifiableCredential> {
		let subject = {};
		subject["appDid"] = appInstanceDid.getAppDid();

        let cal = dayjs();
        cal.add(5, 'year');

		let cb = this.issuer.issueFor(appInstanceDid.getDid());
		let vc = await cb.id("didapp")
				.type("AppIdCredential")
				.properties(subject)
				.expirationDate(cal.toDate())
				.seal(this.getStorePassword());

		UserDID.LOG.info("VerifiableCredential: {}", vc.toString());

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
