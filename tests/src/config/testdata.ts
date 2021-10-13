import { HiveException, VaultServices, AppContext, Logger, Utils, File } from "@dchagastelles/elastos-hive-js-sdk"
import { Claims, DIDDocument, JWTParserBuilder } from '@elastosfoundation/did-js-sdk';
import { AppDID } from '../did/appdid';
import { UserDID } from '../did/userdid';

export class TestData {
	public static readonly USER_DIR = process.env["HIVE_USER_DIR"] ? process.env["HIVE_USER_DIR"] : "/home/diego/temp"

	private static LOG = new Logger("TestData");
    private static readonly RESOLVE_CACHE = "data/didCache";
    private static INSTANCE: TestData;

    private userDid: UserDID;
	private callerDid: UserDID;
	private appInstanceDid: AppDID;
	private context: AppContext;
	private callerContext: AppContext;
	private clientConfig: any;
	private userDir: string;

    constructor(clientConfig: any, userDir: string) {
		this.userDir = userDir;
		this.clientConfig = clientConfig;
    }

    public static async getInstance(testName: string, clientConfig: any, userDir?: string): Promise<TestData> {
		Utils.checkNotNull(clientConfig, "Test configuration cannot be empty");
		Utils.checkNotNull(clientConfig.node, "A valid test configuration is mandatory");
		if (!userDir) {
			userDir = TestData.USER_DIR;
		}
        if (!TestData.INSTANCE) {
			TestData.LOG.info("***** Running {} using '{}' configuration *****", testName, clientConfig.node.storePath);
			TestData.LOG.info("***** Data directory: '{}' *****", userDir);
            TestData.INSTANCE = new TestData(clientConfig, userDir);
			await TestData.INSTANCE.init();
        }
        return TestData.INSTANCE;
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

	public newVault(): VaultServices {
		return new VaultServices(this.context, this.getProviderAddress());
	}

    public async init(): Promise<TestData> {

		let userDirFile = new File(this.userDir);
		userDirFile.delete();

		AppContext.setupResolver(this.clientConfig.resolverUrl, TestData.RESOLVE_CACHE);

		let applicationConfig = this.clientConfig.application;
		this.appInstanceDid = await AppDID.create(applicationConfig.name,
				applicationConfig.mnemonics2,
				applicationConfig.passPhrase,
				applicationConfig.storepass,
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
		let self = this;
		this.context = await AppContext.build({

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
				return null;
			},
			
			async getAuthorization(jwtToken : string) : Promise<string> {
				try {
					let claims : Claims = (await new JWTParserBuilder().build().parse(jwtToken)).getBody();
					if (claims == null)
						throw new HiveException("Invalid jwt token as authorization.");

					let presentation = await self.appInstanceDid.createPresentation(
						await self.userDid.issueDiplomaFor(self.appInstanceDid),
						claims.getIssuer(), claims.get("nonce") as string);
						
					TestData.LOG.debug("TestData->presentation: " + presentation.toString(true)); 
					return await self.appInstanceDid.createToken(presentation,  claims.getIssuer());
				} catch (e) {
					TestData.LOG.info("TestData->getAuthorization error: " + e); 	
					TestData.LOG.error(e.stack);
				}
			}
		}, self.userDid.getDid().toString());

		this.callerContext = await AppContext.build({
			//@Override
			getLocalDataDir(): string {
				return self.getLocalStorePath();
			},

			async getAppInstanceDocument() : Promise<DIDDocument>  {
				try {
					return await self.appInstanceDid.getDocument();
				} catch (e) {
					TestData.LOG.error(e.stack);
				}
				return null;
			},

			async getAuthorization(jwtToken : string) : Promise<string>  {
				
				try {
					let claims : Claims = (await new JWTParserBuilder().build().parse(jwtToken)).getBody();
					if (claims == null)
						throw new HiveException("Invalid jwt token as authorization.");
					return await self.appInstanceDid.createToken(await self.appInstanceDid.createPresentation(
							await self.userDid.issueDiplomaFor(self.appInstanceDid),
							claims.getIssuer(), claims.get("nonce") as string), claims.getIssuer());
				} catch (e) {
					throw new HiveException(e.getMessage(), e);
				}
			}
		}, this.callerDid.getDid().toString());

		return this;
	}

	public getAppDid(): string {
		return this.appInstanceDid.getAppDid();
	}

	public getUserDid(): string {
		return this.userDid.toString();
	}

	public getCallerDid(): string {
		return this.callerDid.toString();
	}
}