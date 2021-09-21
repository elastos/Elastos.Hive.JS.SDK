import { HiveException, VaultServices, AppContext, Logger } from "@dchagastelles/elastos-hive-js-sdk/"
import { AppDID } from '../did/appdid';
import { UserDID } from '../did/userdid';
import { Claims, DIDDocument, JWTParserBuilder } from '@elastosfoundation/did-js-sdk/';
import { File } from '../../..';

export class TestData {
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

    public static async getInstance(clientConfig: any, userDir: string): Promise<TestData> {
        if (!TestData.INSTANCE) {
            TestData.INSTANCE = new TestData(clientConfig, userDir);
        }
        let testData = TestData.INSTANCE;

		return testData.init();
    }

    public async init(): Promise<TestData> {
		AppContext.setupResolver(this.clientConfig.resolverUrl, TestData.RESOLVE_CACHE);

		let applicationConfig = this.clientConfig.application;
		this.appInstanceDid = new AppDID(applicationConfig.name,
				applicationConfig.mnemonic,
				applicationConfig.passPhrase,
				applicationConfig.storepass);

		let userConfig = this.clientConfig.user;
		this.userDid = await UserDID.create(userConfig.name,
				userConfig.mnemonic,
				userConfig.passPhrase,
				userConfig.storepass).then(user => {
                    return user;
                });
		let userConfigCaller = this.clientConfig.cross.user;
		this.callerDid = new UserDID(userConfigCaller.name,
				userConfigCaller.mnemonic,
				userConfigCaller.passPhrase,
				userConfigCaller.storepass);

		//初始化Application Context
		this.context = await AppContext.build({

			getLocalDataDir() : string {
				return this.getLocalStorePath();
			},

			
			async getAppInstanceDocument() : Promise<DIDDocument>  {
				try {
					return await this.appInstanceDid.getDocument();
				} catch (e) {
					e.printStackTrace();
				}
				return null;
			},
			
			async getAuthorization(jwtToken : string) : Promise<string> {
				
					try {
						let claims : Claims = (await new JWTParserBuilder().build().parse(jwtToken)).getBody();
						if (claims == null)
							throw new HiveException("Invalid jwt token as authorization.");
						return this.appInstanceDid.createToken(await this.appInstanceDid.createPresentation(
								await this.userDid.issueDiplomaFor(this.appInstanceDid),
								claims.getIssuer(), claims.get("nonce") as string), claims.getIssuer());
					} catch (e) {
						//throw new CompletionException(new HiveException(e.getMessage()));
					}
			}
		}, this.userDid.getDid().toString());

		this.callerContext = await AppContext.build({
			//@Override
			getLocalDataDir(): string {
				return this.getLocalStorePath();
			},

			async getAppInstanceDocument() : Promise<DIDDocument>  {
				try {
					return await this.appInstanceDid.getDocument();
				} catch (e) {
					e.printStackTrace();
				}
				return null;
			},

			async getAuthorization(jwtToken : string) : Promise<string>  {
				
				try {
					let claims : Claims = (await new JWTParserBuilder().build().parse(jwtToken)).getBody();
					if (claims == null)
						throw new HiveException("Invalid jwt token as authorization.");
					return this.appInstanceDid.createToken(await this.appInstanceDid.createPresentation(
							await this.userDid.issueDiplomaFor(this.appInstanceDid),
							claims.getIssuer(), claims.get("nonce") as string), claims.getIssuer());
				} catch (e) {
					//throw new CompletionException(new HiveException(e.getMessage()));
				}
		}
		}, this.callerDid.getDid().toString());

		return this;
	}

	/**
	 * If run test cases for production environment, please try this:
	 * 	- HIVE_ENV=production ./gradlew build
	 *
	 * @return Client configuration.
	 */
	// getClientConfig = (): ClientConfig => {
	// 	String fileName, hiveEnv = System.getenv("HIVE_ENV");
	// 	if ("production".equals(hiveEnv))
	// 		fileName = "Production.conf";
	// 	else if ("local".equals(hiveEnv))
	// 		fileName = "Local.conf";
	// 	else
	// 		fileName = "Developing.conf";
	// 	log.info(">>>>>> Current config file: " + fileName + " <<<<<<");
	// 	return ClientConfig.deserialize(Utils.getConfigure(fileName));
	// } 

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
		return new VaultServices(this.context, ""); // this.getProviderAddress().);
	}

	// newScriptRunner(): ScriptRunner {
	// 	return new ScriptRunner(this.context, getProviderAddress());
	// }

	// newCallerScriptRunner() : ScriptRunner {
	// 	return new ScriptRunner(this.callerContext, getProviderAddress());
	// }

	// newBackup(): Backup {
	// 	return new Backup(context, nodeConfig.targetHost());
	// }

	//  getBackupService() : BackupServices {
	// 	let bs : BackupService = this.newVault().getBackupService();
	// 	bs.setupContext(new HiveBackupContext() {
	// 		@Override
	// 		public String getType() {
	// 			return null;
	// 		}

	// 		@Override
	// 		public String getTargetProviderAddress() {
	// 			return nodeConfig.targetHost();
	// 		}

	// 		@Override
	// 		public String getTargetServiceDid() {
	// 			return nodeConfig.targetDid();
	// 		}

	// 		@Override
	// 		public CompletableFuture<String> getAuthorization(String srcDid, String targetDid, String targetHost) {
	// 			return CompletableFuture.supplyAsync(() -> {
	// 				try {
	// 					return userDid.issueBackupDiplomaFor(srcDid, targetHost, targetDid).toString();
	// 				} catch (DIDException e) {
	// 					throw new CompletionException(new HiveException(e.getMessage()));
	// 				}
	// 			});
	// 		}
	// 	});
	// 	return bs;
	// }

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