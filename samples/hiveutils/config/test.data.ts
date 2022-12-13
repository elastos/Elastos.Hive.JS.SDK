import {Claims, DIDDocument, JWTParserBuilder} from '@elastosfoundation/did-js-sdk';
import {HiveException, AppContext, Logger, ScriptRunner} from '@elastosfoundation/hive-js-sdk';
import testnet from "./testnet.json";
import mainnet from "./mainnet.json";
import {AppDID} from '../did/appdid';
import {UserDID} from '../did/userdid';

export class TestData {
    private static LOG = new Logger("TestData");

    private static INSTANCE: TestData;

    private appInstanceDid: AppDID;
    private appInstanceDidDoc: DIDDocument;
    // user & owner DID
    private userDid: UserDID;
    // caller DID for the scripting service
    private callerDid: UserDID;

    // for user and caller DIDs
    private userAppContext: AppContext;
    private callerAppContext: AppContext;
    // ???
    private anonymousContext: AppContext;

    private environ: any;

    static getInstance(): TestData {
        if (!TestData.INSTANCE) {
            TestData.INSTANCE = new TestData();
        }
        return TestData.INSTANCE;
    }

    private constructor() {
        Logger.setDefaultLevel(Logger.ERROR);
    }

    async setEnv(env: string): Promise<void> {
        this.environ = env === 'mainnet' ? mainnet : testnet;
        const storeRoot = this.getLocalCachePath(true);
        AppContext.setupResolver(this.environ.resolverUrl, storeRoot);

        let applicationConfig = this.environ.application;
        this.appInstanceDid = await AppDID.create(applicationConfig.name,
            applicationConfig.mnemonic,
            applicationConfig.passPhrase,
            applicationConfig.storepass,
            this.environ.resolverUrl,
            storeRoot, applicationConfig.did);
        this.appInstanceDidDoc = await this.appInstanceDid.getDocument();

        let userConfig = this.environ.user;
        this.userDid = await UserDID.create(userConfig.name,
            userConfig.mnemonic,
            userConfig.passPhrase,
            userConfig.storepass,
            storeRoot, userConfig.did);

        TestData.LOG.info(`user_did: ${this.userDid.toString()}, app_did: ${this.appInstanceDid.getAppDid()}, app_ins_did: ${this.appInstanceDid.toString()}`);

        let userConfigCaller = this.environ.cross.user;
        this.callerDid = await UserDID.create(userConfigCaller.name,
            userConfigCaller.mnemonic,
            userConfigCaller.passPhrase,
            userConfigCaller.storepass,
            storeRoot, userConfigCaller.did);

        this.userAppContext = await this.createContext(this.userDid, AppDID.APP_DID);
        this.callerAppContext = await this.createContext(this.callerDid, AppDID.APP_DID2);
        this.anonymousContext = await this.createContext(this.callerDid, AppDID.APP_DID2);
    }

    /**
     * cache tokens and DIDs, to separate testnet and mainnet
     */
    private getLocalCachePath(containDIDs): string {
        const network = this.environ.resolverUrl;
        if (containDIDs) {
            // based on 'tests' folder for DIDs cache dir.
            return `data/${network}/didCache`;
        }

        // absolute path for tokens cache dir.
        const testsDir = __dirname + '/../../..';
        return `${testsDir}/data/${network}/localCache`;
    }

    /**
     * Create app context
     * @param userDid
     * @param appDid
     * @private
     */
    private async createContext(userDid?: UserDID, appDid?: string): Promise<AppContext> {
        const self = this;
        userDid = userDid ? userDid : this.userDid;
        appDid = appDid ? appDid : AppDID.APP_DID;
        return AppContext.build({
            getLocalDataDir() : string {
                return self.getLocalCachePath(false);
            },
            getAppInstanceDocument() : DIDDocument  {
                return self.appInstanceDidDoc;
            },
            async getAuthorization(jwtToken : string) : Promise<string> {
                try {
                    let claims : Claims = (await new JWTParserBuilder().setAllowedClockSkewSeconds(300).build().parse(jwtToken)).getBody();
                    if (claims == null)
                        throw new HiveException("Invalid jwt token as authorization.");

                    let presentation = await self.appInstanceDid.createPresentation(
                        await userDid.issueDiplomaFor(self.appInstanceDid, appDid),
                        claims.getIssuer(), claims.get("nonce") as string);

                    TestData.LOG.debug("TestData->presentation: " + presentation.toString(true));
                    return await self.appInstanceDid.createToken(presentation,  claims.getIssuer());
                } catch (e) {
                    TestData.LOG.info("TestData->getAuthorization error: " + e);
                    TestData.LOG.error(e.stack);
                    throw e;
                }
            }
        }, userDid.getDid().toString(), appDid);
    }

    getProviderAddress(): string {
        return this.environ.node.provider;
    }

    newCallerScriptRunner(): ScriptRunner {
        return new ScriptRunner(this.callerAppContext, this.getProviderAddress());
    }
}