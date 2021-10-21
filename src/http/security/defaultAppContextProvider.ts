import { Claims, DID, DIDBackend, DIDDocument, DIDStore, DIDURL, Issuer, JWTHeader, JWTParserBuilder, RootIdentity, VerifiableCredential, VerifiablePresentation } from "@elastosfoundation/did-js-sdk";
import { HiveException } from "../../exceptions";
import { AppContextProvider } from "./appcontextprovider";
import dayjs from "dayjs";



export class DefaultAppContextProvider implements AppContextProvider {

    private storePath: string;
    private appDid: string | DID;
    private userDid: string | DID;
    private appStorePass: string;
    private userStorePass: string;
    private appMnemonics: string;
    private userMnemonics: string;

    private appPhrasePass: string;

    private appRootId: RootIdentity;

    private store: DIDStore;
    
    constructor(storePath: string, appStorePass: string, appDid: string | DID,  appMnemonics: string, appPhrasePass: string, userDID: string | DID, userMnemonics:string, userStorePass: string) {
        this.storePath = storePath;
        this.appStorePass = appStorePass;    
        this.userStorePass = userStorePass;
        this.appDid = appDid;
        this.userDid = userDID;
        this.appMnemonics = appMnemonics;
        this.userMnemonics = userMnemonics;
        this.appPhrasePass = appPhrasePass;
    }
    
    public static async create(storePath: string, appStorePass: string, appDid: string | DID, appMnemonics: string, appPhrasePass: string, userDID: string | DID, userMnemonics:string, userStorePass: string) : Promise<DefaultAppContextProvider> {
        let defaultAppContext = new DefaultAppContextProvider(storePath, appStorePass, appDid, appMnemonics, appPhrasePass, userDID, userMnemonics, userStorePass);
        await defaultAppContext.init();
        return defaultAppContext;
    }

    async init() : Promise<void>{
        await this.initPrivateIdentity(this.appMnemonics, this.appStorePass);
        await this.initPrivateIdentity(this.userMnemonics, this.userStorePass);

        await this.initDid();
    }

    public async initPrivateIdentity(mnemonic: string, storePass: string): Promise<void> {
		//let storePath = "data/didCache" + File.SEPARATOR + this.name;

		this.store = await DIDStore.open(this.storePath);

		let id = RootIdentity.getIdFromMnemonic(mnemonic, this.appPhrasePass);
		if (this.store.containsRootIdentity(id)){
			this.appRootId = await this.store.loadRootIdentity(id);
			return; // Already exists
		}


		//DIDEntity.LOG.info("Creating root identity for mnemonic {}", mnemonic);

		try {
			this.appRootId = RootIdentity.createFromMnemonic(mnemonic, this.appPhrasePass, this.store, storePass);
		} catch (e){
			//DIDEntity.LOG.error("Error Creating root identity for mnemonic {}. Error {}", mnemonic, e);
			throw new Error("Error Creating root identity for mnemonic");
		}
		

		
		await this.appRootId.synchronize();

		if (this.appDid !== undefined){
			this.appRootId.setDefaultDid(this.appDid);
			let defaultDid = this.appRootId.getDefaultDid();
			//DIDEntity.LOG.info("************************************* default DID: {}", defaultDid.toString());
		}


		return;
	}

	public async initDid(): Promise<void> {
		let dids = await this.store.listDids();
		if (dids.length > 0) {
			this.appDid = dids[0];
			return;
		}
		
		this.appDid = await this.appRootId.getDefaultDid();
		//DIDEntity.LOG.info("************************************* default DID: {}", this.did.toString());
		let resolvedDoc = await this.appDid.resolve();
		//DIDEntity.LOG.info("************************************* My new DIDDOC resolved: {}", resolvedDoc.toString(true));


		//DIDEntity.LOG.info("{} My new DID created: {}", this.name, this.did.toString());
	}


    getLocalDataDir(): string {
        return this.storePath;
    }

	/**
	 * The method for upper Application to implement to provide current application
	 * instance did document as the running context.
	 * @return The application instance did document.
	 */
	async getAppInstanceDocument(): Promise<DIDDocument> {
        return await this.store.loadDid(this.appDid);
    }

	/**
	 * The method for upper Application to implement to acquire the authorization
	 * code from user's approval.
	 * @param authenticationChallengeJWtCode  The input challenge code from back-end node service.
	 * @return The credential issued by user.
	 */
	async getAuthorization(authenticationChallengeJWtCode: string): Promise<string> {
        try {
            let claims : Claims = (await new JWTParserBuilder().build().parse(authenticationChallengeJWtCode)).getBody();
            if (claims == null)
                throw new HiveException("Invalid jwt token as authorization.");

            let presentation = await this.createPresentation(
                await this.issueDiplomaFor(DID.from(this.appDid)),
                claims.getIssuer(), claims.get("nonce") as string);
                
            //TestData.LOG.debug("TestData->presentation: " + presentation.toString(true)); 
            return await this.createToken(presentation,  claims.getIssuer());
        } catch (e) {
            //TestData.LOG.info("TestData->getAuthorization error: " + e); 	
            //TestData.LOG.error(e.stack);
        }
    }

    private async getIssuer(){

        let userDocument = await DID.from(this.userDid).resolve();
        return new Issuer(userDocument);
    }

    public async issueDiplomaFor(appInstanceDid: DID): Promise<VerifiableCredential> {
		
            let subject = {};
    
            subject["appDid"] = appInstanceDid.toString();
            subject["appInstanceDid"] = appInstanceDid.toString();
    
            let cal = dayjs();
            cal = cal.add(5, 'year');

            
            let issuer = await this.getIssuer();
            let cb = issuer.issueFor(appInstanceDid);
            let vc = await cb.id(DIDURL.from('#app-id-credential', appInstanceDid) as DIDURL)
                    .type("AppIdCredential")
                    .properties(subject)
                    .expirationDate(cal.toDate())
                    .seal(this.getUserStorePassword());
    
            //UserDID.LOG.debug("VerifiableCredential: {}", vc.toString());
            //UserDID.LOG.trace("VerifiableCredential IsValid: {}", vc.isValid());
            return vc;
        }
    

    public async createPresentation(vc: VerifiableCredential, realm: string, nonce: string): Promise<VerifiablePresentation> {

		
		let vpb = await VerifiablePresentation.createFor(this.getAppDid(), null, this.getDIDStore());
		let vp = await vpb.credentials(vc)
				.realm(realm)
				.nonce(nonce)
				.seal(this.getAppStorePassword());
				
		//AppDID.LOG.info("VerifiablePresentation:{}", vp.toString());

		//let listener = VerificationEventListener.getDefaultWithIdent("isValid");
		//AppDID.LOG.trace("VerifiablePresentation is Valid :{}", await vp.isValid(listener));
		//AppDID.LOG.trace("Listener :{}", listener.toString());

		return vp;
	}

	private getAppStorePassword(): string {
		return this.appStorePass;
	}

    private getUserStorePassword(): string {
		return this.userStorePass;
	}

    private async getAppDocument() : Promise<DIDDocument> {
        return await this.store.loadDid(this.appDid)
    }

	private async createToken(vp: VerifiablePresentation, hiveDid: string): Promise<string> {
        let cal = dayjs();
        let iat = cal.unix();
        let nbf = cal.unix();
        let exp = cal.add(3, 'month').unix();

		// Create JWT token with presentation.
		let doc: DIDDocument = await this.getAppDocument();
		let token = await doc.jwtBuilder()
				.addHeader(JWTHeader.TYPE, JWTHeader.JWT_TYPE)
				.addHeader("version", "1.0")
				.setSubject("DIDAuthResponse")
				.setAudience(hiveDid)
				.setIssuedAt(iat)
				.setExpiration(exp)
				.setNotBefore(nbf)
				.claimsWithJson("presentation", vp.toString(true))
				.sign(this.appStorePass);

		//AppDID.LOG.info("JWT Token: {}", token);
		return token;
    }

    protected getDIDStore(): DIDStore {
		return this.store;
	}

	public getAppDid(): DID {
		return DID.from(this.appDid);
	}
}