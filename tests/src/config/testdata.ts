import {
	HiveException,
	VaultServices,
	BackupService,
	AppContext,
	Logger,
	Utils,
	File
} from '@elastosfoundation/hive-js-sdk';
import { Claims, DIDDocument, JWTParserBuilder } from '@elastosfoundation/did-js-sdk';
import { AppDID } from '../did/appdid';
import { UserDID } from '../did/userdid';
import {ProviderService} from "../../../src/restclient/provider/providerservice";
import {Backup} from "../../../src/api/backup";
import {ClientConfig} from "./clientconfig";

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

	public static getUniqueName(prefix: string){
		return `${prefix}_${Date.now().toString()}`;
	}

    public static async getInstance(testName: string): Promise<TestData> {
		console.log(`Get TestData instance for test: ${testName}`);
        if (!TestData.INSTANCE) {
			// TODO: Update ClientConfig here.
            TestData.INSTANCE = new TestData(ClientConfig.DEV, TestData.USER_DIR);
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

	public newVault(): VaultServices {
		return new VaultServices(this.context, this.getProviderAddress());
	}

	public newBackup(): Backup {
		return new Backup(this.context, this.getProviderAddress());
	}

	public createProviderService() {
		return new ProviderService(this.context, this.getProviderAddress());
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
				return Promise.resolve(null);
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
/*
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
				return Promise.resolve(null);
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
					throw new HiveException(e.toString(), e);
				}
			}
		}, this.callerDid.getDid().toString());
*/
		return this;
	}

	public getAppDid(): string {
		return this.appInstanceDid.getAppDid();
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