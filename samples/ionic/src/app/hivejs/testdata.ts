import {
    Claims,
    DIDDocument,
    JWTParserBuilder,
    VerifiableCredential,
    VerifiablePresentation
} from "@elastosfoundation/did-js-sdk";
import {AppContext, HiveException} from '@dchagastelles/elastos-hive-js-sdk';
import {AppDID} from './did/appdid';
import {UserDID} from './did/userdid';
// import * as path from 'path';
import {DID} from '@elastosfoundation/elastos-connectivity-sdk-js';
// import { fileURLToPath } from 'url';

// //we need to change up how __dirname is used for ES6 purposes
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class SdkContext {
    public static INSTANCE: SdkContext;
    public static readonly RESOLVE_CACHE = 'data/didCache';
    // public static readonly RESOLVE_CACHE = '/Users/fred/Fred/workspace/nodejs/react-material-ui/react-examples/photo-gallery/data/didCache';
    // public static readonly USER_DIR = path.join(__dirname, '../../data/userDir');
    // public static readonly USER_DIR = '/Users/fred/Fred/workspace/nodejs/react-material-ui/react-examples/photo-gallery/data/userDir';
    public static readonly USER_DIR = '/data/userDir';
    // public static readonly USER_DIR = '../../data/userDir';
    // private static LOG = new Logger("TestData");

    private context: AppContext;
    private clientConfig: any;
    private userDir: string | undefined;
    private userDid: UserDID;
    private callerDid: UserDID;
    private appInstanceDid: AppDID;
    private callerContext: AppContext;
    private readonly isTest: boolean;

    private appIdCredential: VerifiableCredential;

    static async getInstance(testName: string, clientConfig: any, userDir?: string): Promise<SdkContext> {
        if (!SdkContext.INSTANCE) {
            SdkContext.INSTANCE = new SdkContext(clientConfig, userDir);
            await SdkContext.INSTANCE.init();
        }
        return SdkContext.INSTANCE;
    }

    constructor(clientConfig: any, userDir?: string) {
        this.clientConfig = clientConfig;
        this.userDir = userDir;
        this.isTest = true;
    }

    async init(): Promise<void> {
        console.log('init SdkContest.init.');
        //let userDirFile = new File(this.userDir);
        //userDirFile.delete();
        console.log(`${this.clientConfig.resolverUrl}, ${SdkContext.RESOLVE_CACHE}`);
        AppContext.setupResolver(this.clientConfig.resolverUrl, SdkContext.RESOLVE_CACHE);

        const applicationConfig = this.clientConfig.application;
      console.log('init SdkContest.init 1.');
        this.appInstanceDid = await AppDID.create(applicationConfig.name,
            applicationConfig.mnemonics2,
            applicationConfig.passPhrase,
            applicationConfig.storepass,
            applicationConfig.did);
      console.log('init SdkContest.init 2.');
        const userConfig = this.clientConfig.user;
        this.userDid = await UserDID.create(userConfig.name,
            userConfig.mnemonic,
            userConfig.passPhrase,
            userConfig.storepass,
            userConfig.did);

        // TestData.LOG.trace("UserDid created");
        const userConfigCaller = this.clientConfig.cross.user;
        this.callerDid = await UserDID.create(userConfigCaller.name,
            userConfigCaller.mnemonic,
            userConfigCaller.passPhrase,
            userConfigCaller.storepass,
            userConfigCaller.did);

        //Application Context
        const owner = this;
        this.context = await AppContext.build({
            getLocalDataDir(): string {
                return owner.getLocalStorePath();
            },

            async getAppInstanceDocument(): Promise<DIDDocument>  {
                try {
                    // return await owner.appInstanceDid.getDocument();
                    return await owner.getAppInstanceDIDDoc();
                } catch (e) {
                    // TestData.LOG.debug("TestData.getAppInstanceDocument Error {}", e);
                    // TestData.LOG.error(e.stack);
                }
                return null;
            },

            async getAuthorization(jwtToken: string): Promise<string> {
                try {
                    console.log(`before get claims.`);
                    const claims: Claims = (await new JWTParserBuilder().build().parse(jwtToken)).getBody();
                    if (claims == null)
                        {throw new HiveException('Invalid jwt token as authorization.');}
                    console.log(`before createPresentation().`);
                    const presentation = await owner.appInstanceDid.createPresentation(
                        await owner.userDid.issueDiplomaFor(owner.appInstanceDid),
                        claims.getIssuer(), claims.get('nonce') as string);

                    console.log(`before createToken(), presentation, ${presentation}, issuer, ${claims.getIssuer()}`);
                    const token = await owner.appInstanceDid.createToken(presentation,  claims.getIssuer());
                    console.log(`the token for auth(): ${token}`);
                    return token;
                } catch (e) {
                    console.error(`TestData->getAuthorization error: ${e}, ${e.stack}`);
                    return '';
                }
            }
        }, owner.userDid.getDid().toString());

        this.callerContext = await AppContext.build({
            //@Override
            getLocalDataDir(): string {
                return owner.getLocalStorePath();
            },

            async getAppInstanceDocument(): Promise<DIDDocument>  {
                try {
                    return await owner.appInstanceDid.getDocument();
                } catch (e) {
                    // TestData.LOG.error(e.stack);
                }
                return null;
            },

            async getAuthorization(jwtToken: string): Promise<string>  {
                try {
                    return owner.getAuthAuthorization(jwtToken);
                } catch (e) {
                    throw new HiveException(e.getMessage(), e);
                }
            }
        }, this.callerDid.getDid().toString());

      console.log('leave SdkContest.init.');
    }

    getAppContext(): AppContext {
        return this.context;
    }

    getProviderAddress(): string {
        return this.clientConfig.node.provider;
    }

    public getLocalStorePath(): string {
      return `${this.userDir}/data/store/${this.clientConfig.node.storePath}`;
    }

    public getUserDid(): string {
      return this.userDid.toString();
    }

    public getAppDid(): string {
      return this.appInstanceDid.getAppDid();
    }

    async getAppInstanceDIDDoc(): Promise<DIDDocument> {
        if (this.isTest) {
            return await this.appInstanceDid.getDocument();
        }
        return AppDID.getAppInstanceDIDDoc();
    }

    async getAuthAuthorization(challenge: string): Promise<string> {
        if (this.isTest) {
            const claims: Claims = (await new JWTParserBuilder().build().parse(challenge)).getBody();
            if (claims == null)
                {throw new HiveException('Invalid jwt token as authorization.');}
            return await this.appInstanceDid.createToken(await this.appInstanceDid.createPresentation(
                await this.userDid.issueDiplomaFor(this.appInstanceDid),
                claims.getIssuer(), claims.get('nonce') as string), claims.getIssuer());
        }
        const claims: Claims = (await new JWTParserBuilder().build().parse(challenge)).getBody();
        if (claims == null) {
            throw new HiveException('Invalid jwt token as authorization.');
        }
        if (!claims.getIssuer() || !(claims.get('nonce') as string)) {
            throw new HiveException('The received authentication JWT token does not contain iss or nonce');
        }
        const nonce = claims.get('nonce') as string;
        const hiveDid = claims.getIssuer();
        this.appIdCredential = await this.checkAppIdCredentialStatus(this.appIdCredential);
        if (!this.appIdCredential) {
            throw new HiveException('Can not get the credential for the application instance.');
        }
        const vp: VerifiablePresentation = await AppDID.createVerifiablePresentation(
            this.appIdCredential, hiveDid, nonce, this.appInstanceDid.getStorePassword());
        return await AppDID.createChallengeResponse(vp, hiveDid, this.appInstanceDid.getStorePassword());
    }

    checkAppIdCredentialStatus(appIdCredential): Promise<VerifiableCredential> {
        return new Promise(async (resolve, reject) => {
            if (this.checkCredentialValid(appIdCredential)) {
                // Logger.log(TAG, 'Credential valid , credential is ', appIdCredential);
                resolve(appIdCredential);
                return;
            }

            // Logger.warn(TAG, 'Credential invalid, Getting app identity credential');
            const didAccess = new DID.DIDAccess();
            try {
                let credential = await didAccess.getExistingAppIdentityCredential();
                if (credential) {
                    // Logger.log(TAG, 'Get app identity credential', mAppIdCredential);
                    resolve(credential);
                    return;
                }

                credential = await didAccess.generateAppIdCredential();
                if (credential) {
                    // Logger.log(TAG, 'Generate app identity credential, credential is ', mAppIdCredential);
                    resolve(credential);
                    return;
                }

                const error = 'Get app identity credential error, credential is ' + JSON.stringify(credential);
                // Logger.error(TAG, error);
                reject(error);
            } catch (error) {
                reject(error);
                // Logger.error(TAG, error);
            }
        });
    }

    checkCredentialValid(appIdCredential): boolean {
        return appIdCredential && appIdCredential.getExpirationDate().valueOf() >= new Date().valueOf();
    }
}
