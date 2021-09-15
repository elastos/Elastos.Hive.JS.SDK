import { Logger } from '../../../logger';
import { AppDID } from '../did/appdid';
import { UserDID } from '../did/userdid';
import { AppContext } from '../../../http/security/appcontext';
import { inheritInnerComments } from '@babel/types';
import { ClientConfig } from './clientconfig';

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

    private constructor() {
        this.init();
    }

    public static getInstance() {
        if (!TestData.INSTANCE) {
            TestData.INSTANCE = new TestData();
        }
        return TestData.INSTANCE;
    }

    public init(): void {
		ClientConfig.setConfiguration(ClientConfig.LOCAL);
		AppContext.setupResolver(ClientConfig.get().resolverUrl, TestData.RESOLVE_CACHE);

		let applicationConfig = ClientConfig.get().application;
		this.appInstanceDid = new AppDID(applicationConfig.name,
				applicationConfig.mnemonic,
				applicationConfig.passPhrase,
				applicationConfig.storepass);

		let userConfig = ClientConfig.get().user;
		this.userDid = UserDID.create(userConfig.name,
				userConfig.mnemonic,
				userConfig.passPhrase,
				userConfig.storepass).then(user => {
                    return user;
                });
		UserConfig userConfigCaller = clientConfig.crossConfig().userConfig();
		callerDid = new UserDID(userConfigCaller.name(),
				userConfigCaller.mnemonic(),
				userConfigCaller.passPhrase(),
				userConfigCaller.storepass());

		nodeConfig = clientConfig.nodeConfig();

		//初始化Application Context
		context = AppContext.build(new AppContextProvider() {
			@Override
			public String getLocalDataDir() {
				return getLocalStorePath();
			}

			@Override
			public DIDDocument getAppInstanceDocument() {
				try {
					return appInstanceDid.getDocument();
				} catch (DIDException e) {
					e.printStackTrace();
				}
				return null;
			}

			@Override
			public CompletableFuture<String> getAuthorization(String jwtToken) {
				return CompletableFuture.supplyAsync(() -> {
					try {
						Claims claims = new JwtParserBuilder().build().parseClaimsJws(jwtToken).getBody();
						if (claims == null)
							throw new HiveException("Invalid jwt token as authorization.");
						return appInstanceDid.createToken(appInstanceDid.createPresentation(
								userDid.issueDiplomaFor(appInstanceDid),
								claims.getIssuer(), (String) claims.get("nonce")), claims.getIssuer());
					} catch (Exception e) {
						throw new CompletionException(new HiveException(e.getMessage()));
					}
				});
			}
		}, userDid.toString());

		callerContext = AppContext.build(new AppContextProvider() {
			@Override
			public String getLocalDataDir() {
				return getLocalStorePath();
			}

			@Override
			public DIDDocument getAppInstanceDocument() {
				try {
					return appInstanceDid.getDocument();
				} catch (DIDException e) {
					e.printStackTrace();
				}
				return null;
			}

			@Override
			public CompletableFuture<String> getAuthorization(String jwtToken) {
				return CompletableFuture.supplyAsync(() -> {
					try {
						Claims claims = new JwtParserBuilder().build().parseClaimsJws(jwtToken).getBody();
						if (claims == null)
							throw new HiveException("Invalid jwt token as authorization.");
						return appInstanceDid.createToken(appInstanceDid.createPresentation(
								callerDid.issueDiplomaFor(appInstanceDid),
								claims.getIssuer(),
								(String) claims.get("nonce")), claims.getIssuer());
					} catch (Exception e) {
						throw new CompletionException(new HiveException(e.getMessage()));
					}
				});
			}
		}, callerDid.toString());
	}

	/**
	 * If run test cases for production environment, please try this:
	 * 	- HIVE_ENV=production ./gradlew build
	 *
	 * @return Client configuration.
	 */
	private ClientConfig getClientConfig() {
		String fileName, hiveEnv = System.getenv("HIVE_ENV");
		if ("production".equals(hiveEnv))
			fileName = "Production.conf";
		else if ("local".equals(hiveEnv))
			fileName = "Local.conf";
		else
			fileName = "Developing.conf";
		log.info(">>>>>> Current config file: " + fileName + " <<<<<<");
		return ClientConfig.deserialize(Utils.getConfigure(fileName));
	}

	private String getLocalStorePath() {
		return System.getProperty("user.dir") + File.separator + "data/store" + File.separator + nodeConfig.storePath();
	}

	public AppContext getAppContext() {
		return this.context;
	}

	public String getProviderAddress() {
		return nodeConfig.provider();
	}

	public Vault newVault() {
		return new Vault(context, getProviderAddress());
	}

	public ScriptRunner newScriptRunner() {
		return new ScriptRunner(context, getProviderAddress());
	}

	public ScriptRunner newCallerScriptRunner() {
		return new ScriptRunner(callerContext, getProviderAddress());
	}

	public Backup newBackup() {
		return new Backup(context, nodeConfig.targetHost());
	}

	public BackupService getBackupService() {
		BackupService bs = this.newVault().getBackupService();
		bs.setupContext(new HiveBackupContext() {
			@Override
			public String getType() {
				return null;
			}

			@Override
			public String getTargetProviderAddress() {
				return nodeConfig.targetHost();
			}

			@Override
			public String getTargetServiceDid() {
				return nodeConfig.targetDid();
			}

			@Override
			public CompletableFuture<String> getAuthorization(String srcDid, String targetDid, String targetHost) {
				return CompletableFuture.supplyAsync(() -> {
					try {
						return userDid.issueBackupDiplomaFor(srcDid, targetHost, targetDid).toString();
					} catch (DIDException e) {
						throw new CompletionException(new HiveException(e.getMessage()));
					}
				});
			}
		});
		return bs;
	}

	public String getAppDid() {
		return appInstanceDid.getAppDid();
	}

	public String getUserDid() {
		return userDid.toString();
	}

	public String getCallerDid() {
		return this.callerDid.toString();
	}
}