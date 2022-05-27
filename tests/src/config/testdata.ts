import { Claims, DIDDocument, JWTParserBuilder } from '@elastosfoundation/did-js-sdk';
import { HiveException, Vault, BackupService, AppContext, Logger, Provider, Backup, ScriptRunner } from '@elastosfoundation/hive-js-sdk';
import { AppDID } from '../did/appdid';
import { UserDID } from '../did/userdid';
import { ClientConfig } from "./clientconfig";

export class TestData {
    private static LOG = new Logger("TestData");

    private static INSTANCE: TestData;
    // configure for mainnet or testnet
    private readonly clientConfig: any;

    private appInstanceDid: AppDID;
    // user & owner DID
    private userDid: UserDID;
    // caller DID for the scripting service
    private callerDid: UserDID;

    // for user and caller DIDs
    private userAppContext: AppContext;
    private callerAppContext: AppContext;
    // ???
    private anonymousContext: AppContext;

    static async getInstance(testName: string): Promise<TestData> {
        if (!TestData.INSTANCE) {
            TestData.INSTANCE = await new TestData().init();
            TestData.LOG.log(`TestData.INSTANCE for test: ${testName}, provider, ${TestData.INSTANCE.getProviderAddress()}`);
        }
        return TestData.INSTANCE;
    }

    constructor() {
        // TODO: Update ClientConfig here: ClientConfig.CUSTOM for mainnet, ClientConfig.DEV for testnet.
        this.clientConfig = ClientConfig.DEV;
    }

    async init(): Promise<TestData> {
        const storeRoot = this.getLocalCachePath(true);
        AppContext.setupResolver(this.clientConfig.resolverUrl, storeRoot);

        let applicationConfig = this.clientConfig.application;
        this.appInstanceDid = await AppDID.create(applicationConfig.name,
            applicationConfig.mnemonic,
            applicationConfig.passPhrase,
            applicationConfig.storepass,
            this.clientConfig.resolverUrl,
            storeRoot, applicationConfig.did);

        let userConfig = this.clientConfig.user;
        this.userDid = await UserDID.create(userConfig.name,
            userConfig.mnemonic,
            userConfig.passPhrase,
            userConfig.storepass,
            storeRoot, userConfig.did);

        TestData.LOG.trace("UserDid created");

        let userConfigCaller = this.clientConfig.cross.user;
        this.callerDid = await UserDID.create(userConfigCaller.name,
            userConfigCaller.mnemonic,
            userConfigCaller.passPhrase,
            userConfigCaller.storepass,
            storeRoot, userConfigCaller.did);

        this.userAppContext = await this.createContext(this.userDid, AppDID.APP_DID);
        this.callerAppContext = await this.createContext(this.callerDid, AppDID.APP_DID2);
        this.anonymousContext = await this.createContext(this.callerDid, AppDID.APP_DID2);
        return this;
    }

    /**
     * cache tokens and DIDs, to separate testnet and mainnet
     */
    private getLocalCachePath(containDIDs): string {
        const network = this.clientConfig.resolverUrl;
        if (containDIDs) {
            // based on 'tests' folder for DIDs cache dir.
            return `data/${network}/didCache`;
        }

        // absolute path for tokens cache dir.
        const testsDir = __dirname + '/../..';
        return `${testsDir}/data/${network}/localCache`;
    }

	getUserAppContext(): AppContext {
		return this.userAppContext;
	}

    getCallerAppContext(): AppContext {
        return this.callerAppContext;
    }

	getProviderAddress(): string {
		return this.clientConfig.node.provider;
	}

	newVault(): Vault {
		return new Vault(this.userAppContext, this.getProviderAddress());
	}

	newAnonymousCallerScriptRunner(): ScriptRunner {
		return new ScriptRunner(this.anonymousContext, this.getProviderAddress());
	}

	newBackup(): Backup {
		return new Backup(this.userAppContext, this.getProviderAddress());
	}

	createProviderService() {
		return new Provider(this.userAppContext, this.getProviderAddress());
	}

	private async createContext(userDid: UserDID, appDid: string): Promise<AppContext> {
    	const self = this;
		return await AppContext.build({

			getLocalDataDir() : string {
				return self.getLocalCachePath(false);
			},

			async getAppInstanceDocument() : Promise<DIDDocument>  {
				try {
					return await self.appInstanceDid.getDocument();
				} catch (e) {
					TestData.LOG.debug("TestData.getAppInstanceDocument Error {}", e);
					TestData.LOG.error(e.stack);
                    throw e;
				}
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
		}, userDid.getDid().toString());
	}

	getAppDid(): string {
		return AppDID.APP_DID;
	}

	getUserDid(): string {
		return this.userDid.toString();
	}

	private getTargetProviderAddress(): string {
		return this.clientConfig.node.targetHost;
	}

	private getTargetServiceDid(): string {
		return this.clientConfig.node.targetDid;
	}

	getCallerDid(): string {
		return this.callerDid.toString();
	}

	getIpfsGatewayUrl(): string {
		return this.clientConfig.ipfsGateUrl;
	}

	getBackupService(): BackupService {
		const backupService = this.newVault().getBackupService();
		const self = this;
		backupService.setBackupContext({
			getParameter(parameter:string): string {
				switch (parameter) {
					case "targetAddress":
						return self.getTargetProviderAddress();

					case "targetServiceDid":
						return self.getTargetServiceDid();

					default:
						break;
				}
				return null;
			},

			getType(): string {
				return null;
			},

			async getAuthorization(srcDid: string, targetDid: string, targetHost: string): Promise<string> {
				try {
					return (await self.userDid.issueBackupDiplomaFor(srcDid, targetHost, targetDid)).toString();
				} catch (e) {
					throw new HiveException(e.toString());
				}

			}
		});
		return backupService;
	}
}