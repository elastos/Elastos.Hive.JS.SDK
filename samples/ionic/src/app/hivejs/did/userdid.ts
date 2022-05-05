import { VerifiableCredential, Issuer, DIDURL } from "@elastosfoundation/did-js-sdk";
import dayjs from "dayjs";
import { DIDEntity } from "./didentity";
import { AppDID } from "./appdid";

export class UserDID extends DIDEntity {
	private issuer: Issuer;

	constructor(name: string, mnemonic: string, phrasepass: string, storepass: string, did?: string) {
		super(name, mnemonic, phrasepass, storepass, did);
	}

    public static async create(name: string, mnemonic: string, phrasepass: string, storepass: string, did?:string): Promise<UserDID> {
        let newInstance = new UserDID(name, mnemonic, phrasepass, storepass, did);
        await newInstance.initDid(mnemonic, true);
        let doc = await newInstance.getDocument();
        newInstance.setIssuer(new Issuer(doc));
        return newInstance;
    }

    private setIssuer(issuer: Issuer): void {
        this.issuer = issuer;
    }

	public async issueDiplomaFor(appInstanceDid: AppDID, appDid?: string): Promise<VerifiableCredential> {
		let subject = {};

		subject["appDid"] = appDid ? appDid : AppDID.APP_DID;
		// subject["appInstanceDid"] = appInstanceDid.getDid();

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
        cal = cal.add(5, 'year');

        // INFO: try to remove this line.
		this.setIssuer(new Issuer(await this.getDocument()));

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
