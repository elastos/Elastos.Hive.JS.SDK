import { Claims, DID, DIDBackend, DIDDocument, DIDStore, DIDURL, Issuer, JWTHeader, JWTParserBuilder, RootIdentity, VerifiableCredential, VerifiablePresentation } from "@elastosfoundation/did-js-sdk";
import { HiveException } from "../../exceptions";
import { AppContextProvider } from "./appcontextprovider";
import dayjs from "dayjs";
import { Logger } from "../../logger";
//import { ShorthandPropertyAssignment } from "typescript";


export class AppContextParameters {
	storePath: string;
	appDID: string | DID;
	appMnemonics: string;
	appPhrasePass: string;
	appStorePass: string;
	
	userDID: string | DID;
	userMnemonics:string;
	userPhrasePass: string;
	userStorePass: string;
}


export class DefaultAppContextProvider implements AppContextProvider {

	private static LOG = new Logger("DefaultAppContextProvider");


    private contextParameters: AppContextParameters;

	private appRootId: RootIdentity;
	private userRootId: RootIdentity;
    private store: DIDStore;
    
    constructor(contextParameters: AppContextParameters) {
		this.contextParameters = contextParameters;
    }
    
    public static async create(contextParameters: AppContextParameters) : Promise<DefaultAppContextProvider> {
        let defaultAppContext = new DefaultAppContextProvider(contextParameters);
        await defaultAppContext.init();
        return defaultAppContext;
    }

    async init() : Promise<void>{
		this.appRootId = await this.initPrivateIdentity(this.contextParameters.appMnemonics, this.contextParameters.appDID, this.contextParameters.appStorePass);
		DefaultAppContextProvider.LOG.debug("Init app private identity");


        this.userRootId = await this.initPrivateIdentity(this.contextParameters.userMnemonics, this.contextParameters.userDID, this.contextParameters.userStorePass);
		DefaultAppContextProvider.LOG.debug("Init user private identity");

		await this.initDid(this.appRootId);
		await this.initDid(this.userRootId);
    }

    public async initPrivateIdentity(mnemonic: string, did: string|DID, storePass: string): Promise<RootIdentity> {
		this.store = await DIDStore.open(this.contextParameters.storePath);

		DefaultAppContextProvider.LOG.debug("Opens store");
		let id = RootIdentity.getIdFromMnemonic(mnemonic, this.contextParameters.appPhrasePass);

		DefaultAppContextProvider.LOG.debug("ID from mnemonic {} : {}", mnemonic, id);

		if (this.store.containsRootIdentity(id)){
			DefaultAppContextProvider.LOG.debug("Store constains RootIdentity");
			return await this.store.loadRootIdentity(id);
		}

		let rootIdentity : RootIdentity = undefined;
		try {
			DefaultAppContextProvider.LOG.info("Creating root identity for mnemonic {}", mnemonic);
			rootIdentity = RootIdentity.createFromMnemonic(mnemonic, this.contextParameters.appPhrasePass, this.store, storePass);
		} catch (e){
			DefaultAppContextProvider.LOG.error("Error Creating root identity for mnemonic {}. Error {}", mnemonic, JSON.stringify(e));
			throw new Error("Error Creating root identity for mnemonic");
		}
		
		await rootIdentity.synchronize();
		rootIdentity.setDefaultDid(this.contextParameters.appDID);

		return rootIdentity;
	}

	public async initDid(rootIdentity: RootIdentity): Promise<void> {
		let dids = await this.store.listDids();
		if (dids.length > 0) {
			this.contextParameters.appDID = dids[0];
			return;
		}
		DefaultAppContextProvider.LOG.debug("Init app did");

		let did = await rootIdentity.getDefaultDid();
		let resolvedDoc = await did.resolve();
		await this.store.storeDid(resolvedDoc);
		DefaultAppContextProvider.LOG.debug("Resolve app doc");
	}


    getLocalDataDir(): string {
        return this.contextParameters.storePath;
    }

	/**
	 * The method for upper Application to implement to provide current application
	 * instance did document as the running context.
	 * @return The application instance did document.
	 */
	async getAppInstanceDocument(): Promise<DIDDocument> {
        return await this.store.loadDid(this.contextParameters.appDID);
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


			DefaultAppContextProvider.LOG.debug("getAuthorization createPresentation");	
			
			let diploma = await this.issueDiplomaFor(DID.from(this.contextParameters.appDID));
			DefaultAppContextProvider.LOG.debug("diploma created");	

			let presentation = await this.createPresentation(
                diploma,
                claims.getIssuer(), claims.get("nonce") as string);
                
            //TestData.LOG.debug("TestData->presentation: " + presentation.toString(true)); 
            return await this.createToken(presentation,  claims.getIssuer());
        } catch (e) {
			DefaultAppContextProvider.LOG.error("TestData->getAuthorization error: {} stack {}", e, e.stack);	
        }
    }

    private async getIssuer(){
		DefaultAppContextProvider.LOG.debug("getIssuer");	

		let userDocument = await this.store.loadDid(this.contextParameters.userDID);
		
		DefaultAppContextProvider.LOG.debug("userDocument: {}", userDocument.toString(true));	

		try {

			let issuer = new Issuer(userDocument);
			return issuer;
		} catch (e){
			DefaultAppContextProvider.LOG.debug("error new Issuer {}", e);	

			return null;
		}

    }

    public async issueDiplomaFor(appInstanceDid: DID): Promise<VerifiableCredential> {
			DefaultAppContextProvider.LOG.debug("issueDiplomaFor");	

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
    
			DefaultAppContextProvider.LOG.debug("VerifiableCredential IsValid: {}", vc.isValid());	
            return vc;
        }
    

    public async createPresentation(vc: VerifiableCredential, realm: string, nonce: string): Promise<VerifiablePresentation> {
		DefaultAppContextProvider.LOG.debug("create Presentation");
		
		let vpb = await VerifiablePresentation.createFor(this.getAppDid(), null, this.getDIDStore());
		let vp = await vpb.credentials(vc)
				.realm(realm)
				.nonce(nonce)
				.seal(this.getAppStorePassword());
				
		DefaultAppContextProvider.LOG.debug("VerifiablePresentation:{}", vp.toString());
		return vp;
	}

	private getAppStorePassword(): string {
		return this.contextParameters.appStorePass;
	}

    private getUserStorePassword(): string {
		return this.contextParameters.userStorePass;
	}

    private async getAppDocument() : Promise<DIDDocument> {
        return await this.store.loadDid(this.contextParameters.appDID)
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
				.sign(this.contextParameters.appStorePass);

		return token;
    }

    protected getDIDStore(): DIDStore {
		return this.store;
	}

	public getAppDid(): DID {
		return DID.from(this.contextParameters.appDID);
	}
}