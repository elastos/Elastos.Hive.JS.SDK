import { Logger } from '../../../logger';
import { AppDID } from '../did/appdid';
import { UserDID } from '../did/userdid';
import { AppContext } from '../../../http/security/appcontext';
import { AppContextProvider } from '../../../http/security/appcontextprovider';
import { VaultServices } from '../../../api/vaultservices';
import { BackupServices } from '../../../api/backupservices';
import { inheritInnerComments } from '@babel/types';
import { ClientConfig } from './clientconfig';
import { Claims, DIDDocument, JWTParserBuilder } from '@elastosfoundation/did-js-sdk/typings';
import { HiveException } from '../../../exceptions';
import { BackupService } from '../../../restclient/backup/backupservice';

export class TestData {
    private static LOG = new Logger("TestData");
    private static readonly RESOLVE_CACHE = "data/didCache";
    private static INSTANCE: TestData;

    private userDid: UserDID;
	private callerDid: UserDID;
	private appInstanceDid: AppDID;
	private nodeConfig: any;
	private context: AppContext ;
	private callerContext: AppContext;

    constructor() {
        void this.init();
    }

    public static getInstance() {
        if (!TestData.INSTANCE) {
            TestData.INSTANCE = new TestData();
        }
        return TestData.INSTANCE;
    }

    public init = async(): Promise<void> => {
		ClientConfig.setConfiguration(ClientConfig.LOCAL);
		AppContext.setupResolver(ClientConfig.get().resolverUrl, TestData.RESOLVE_CACHE);

		let applicationConfig = ClientConfig.get().application;
		this.appInstanceDid = new AppDID(applicationConfig.name,
				applicationConfig.mnemonic,
				applicationConfig.passPhrase,
				applicationConfig.storepass);

		let userConfig = ClientConfig.get().user;
		this.userDid = await UserDID.create(userConfig.name,
				userConfig.mnemonic,
				userConfig.passPhrase,
				userConfig.storepass).then(user => {
                    return user;
                });
		let userConfigCaller = ClientConfig.get().cross.user;
		this.callerDid = new UserDID(userConfigCaller.name,
				userConfigCaller.mnemonic,
				userConfigCaller.passPhrase,
				userConfigCaller.storepass);

		this.nodeConfig = ClientConfig.LOCAL;

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

	getLocalStorePath = () : string => {
		return ""; // System.getProperty("user.dir") + File.separator + "data/store" + File.separator + nodeConfig.storePath();
	}

	getAppContext() : AppContext {
		return this.context;
	}

	getProviderAddress() : AppContext {
		return this.nodeConfig.provider();
	}

	newVault() : VaultServices {
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

	getAppDid = () : string  => {
		return this.appInstanceDid.getAppDid();
	}

	getUserDid = () : string => {
		return this.userDid.toString();
	}

	getCallerDid = () : string => {
		return this.callerDid.toString();
	}
}