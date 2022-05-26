import {
	HiveException,
	Vault,
	BackupService,
	AppContext,
	Logger,
	File, Provider, Backup, ScriptRunner
} from '@elastosfoundation/hive-js-sdk';
import { Claims, DIDDocument, JWTParserBuilder, DIDBackend, DefaultDIDAdapter } from '@elastosfoundation/did-js-sdk';
import { AppDID } from '../did/appdid';
import { UserDID } from '../did/userdid';
import {ClientConfig} from "./clientconfig";

export class TestData {
	public static readonly USER_DIR = process.env["HIVE_USER_DIR"] ?
		process.env["HIVE_USER_DIR"] : __dirname + '/../../data/userDir';

	private static LOG = new Logger("TestData");
    public static readonly RESOLVE_CACHE = "data/didCache";
    private static INSTANCE: TestData;

    private userDid: UserDID;
	private callerDid: UserDID;
	private appInstanceDid: AppDID;
	private context: AppContext;
	private anonymousContext: AppContext;
	private callerContext: AppContext;
	private clientConfig: any;
	private userDir: string;

    constructor(clientConfig: any, userDir: string) {
		this.userDir = userDir;
		this.clientConfig = clientConfig;
    }

	public static getUniqueName(prefix: string){
		return `${prefix}_${Date.now().toString()}`;
	}

    public static async getInstance(testName: string, clientConfig: any = ClientConfig.DEV): Promise<TestData> {
		TestData.LOG.log(`Get TestData instance for test: ${testName}`);
        if (!TestData.INSTANCE) {
			// TODO: Update ClientConfig here: ClientConfig.CUSTOM for mainnet, ClientConfig.DEV for testnet.
            TestData.INSTANCE = new TestData(clientConfig, TestData.USER_DIR);
			await TestData.INSTANCE.init();
        }
        return TestData.INSTANCE;
    }

    public getClientConfig() {
    	return this.clientConfig;
	}

	public getLocalStorePath(): string {
		return this.userDir + File.SEPARATOR + "data/store" + File.SEPARATOR + this.clientConfig.node.storePath;
	}

	public getAppContext(): AppContext {
		return this.context;
	}

	public getProviderAddress(): string {
		return this.clientConfig.node.provider;
	}

	public newVault(): Vault {
		return new Vault(this.context, this.getProviderAddress());
	}

	public newAnonymousCallerScriptRunner(): ScriptRunner {
		return new ScriptRunner(this.anonymousContext, this.getProviderAddress());
	}

	public newBackup(): Backup {
		return new Backup(this.context, this.getProviderAddress());
	}

	public createProviderService() {
		return new Provider(this.context, this.getProviderAddress());
	}

    public async init(): Promise<TestData> {
		AppContext.setupResolver(this.clientConfig.resolverUrl, TestData.RESOLVE_CACHE);
		if (!DIDBackend.isInitialized()) {
			DIDBackend.initialize(new DefaultDIDAdapter(this.clientConfig.resolverUrl));
		}
		let applicationConfig = this.clientConfig.application;
		this.appInstanceDid = await AppDID.create(applicationConfig.name,
				applicationConfig.mnemonic,
				applicationConfig.passPhrase,
				applicationConfig.storepass,
				this.clientConfig.resolverUrl,
				applicationConfig.did);

		
		let userConfig = this.clientConfig.user;
		this.userDid = await UserDID.create(userConfig.name,
				userConfig.mnemonic,
				userConfig.passPhrase,
				userConfig.storepass,
				userConfig.did);
				
		TestData.LOG.trace("UserDid created"); 
		let userConfigCaller = this.clientConfig.cross.user;
		this.callerDid = await UserDID.create(userConfigCaller.name,
			userConfigCaller.mnemonic,
			userConfigCaller.passPhrase,
			userConfigCaller.storepass,
			userConfigCaller.did);
					
		//Application Context
		this.context = await this.createContext(this.userDid, AppDID.APP_DID);
		this.anonymousContext = await this.createContext(this.callerDid, AppDID.APP_DID2);
		return this;
	}

	private async createContext(userDid: UserDID, appDid: string): Promise<AppContext> {
    	const self = this;
		return await AppContext.build({

			getLocalDataDir() : string {
				return self.getLocalStorePath();
			},

			async getAppInstanceDocument() : Promise<DIDDocument>  {
				try {
					return await self.appInstanceDid.getDocument();
				} catch (e) {
					TestData.LOG.debug("TestData.getAppInstanceDocument Error {}", e);
					TestData.LOG.error(e.stack);
				}
				return Promise.resolve(null);
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
				}
			}
		}, userDid.getDid().toString());
	}

	public getAppDid(): string {
		return AppDID.APP_DID;
	}

	public getUserDid(): string {
		return this.userDid.toString();
	}

	public getUser(): UserDID {
		return this.userDid;
	}

	private getTargetProviderAddress(): string {
		return this.clientConfig.node.targetHost;
	}

	private getTargetServiceDid(): string {
		return this.clientConfig.node.targetDid;
	}

	public getCallerDid(): string {
		return this.callerDid.toString();
	}

	public getIpfsGatewayUrl(): string {
		return this.clientConfig.ipfsGateUrl;
	}

	public getBackupService(): BackupService {
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