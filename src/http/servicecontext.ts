import { checkNotNull } from '../domain/utils'
import { File } from '../domain/file'
import { AppContext } from './security/appcontext'
import { AccessToken } from './security/accesstoken'
import { DataStorage } from '../domain/datastorage'
import { FileStorage } from '../domain/filestorage'
import { BridgeHandler } from './security/bridgehandler';
import { Claims } from '../domain/jwt/claims'
import { NotImplementedException } from '../exceptions'
import { NodeVersion } from '../domain/nodeversion'
import { HttpClient } from './httpclient'
import { AboutService } from '../restclient/about/aboutservice'
import { JWTParserBuilder } from '../domain/jwt/jwtparserbuilder'
import { Logger } from '../logger';

export class ServiceContext {
    private context: AppContext;
	private providerAddress: string;
    private aboutService: AboutService;
	private appDid: string;
	private appInstanceDid: string;
	private serviceInstanceDid: string;

	private accessToken: AccessToken;
	private dataStorage: DataStorage;

    constructor(context: AppContext, providerAddress: string) {
        checkNotNull(context, "Empty context parameter");
        checkNotNull(providerAddress, "Empty provider address parameter");

        this.context = context;
        this.providerAddress = providerAddress;

        this.init();
    }

    private init():void {
        
        let dataDir = this.context.getAppContextProvider().getLocalDataDir();
		if (!dataDir.endsWith(File.SEPARATOR))
			dataDir += File.SEPARATOR;

        this.dataStorage = new FileStorage(dataDir, this.context.getUserDid());
        this.accessToken = new AccessToken(this, this.dataStorage, new BridgeHandlerImpl(this));
        this.aboutService = new AboutService(this, new HttpClient(this, HttpClient.NO_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS));
    }

    public getAccessToken(): AccessToken {
        return this.accessToken;
    }

    public getProviderAddress(): string {
        return this.providerAddress;
    }

    public getAppContext(): AppContext {
		return this.context;
	}

     /**
      * Get the user DID string of this ServiceContext.
      *
      * @return user did
      */
     public getUserDid(): string {
         return this.context.getUserDid();
     }
 
     /**
      * Get the application DID in the current calling context.
      *
      * @return application did
      */
     public getAppDid(): string {
         return this.appDid;
     }

     /**
      * Get the application instance DID in the current calling context;
      *
      * @return application instance did
      */
     public getAppInstanceDid(): string {
         return this.appInstanceDid;
     }

     /**
      * Get the remote node service application DID.
      *
      * @return node service did
      */
     public getServiceDid(): string {
         throw new NotImplementedException();
     }
 
     /**
      * Get the remote node service instance DID where is serving the storage service.
      *
      * @return node service instance did
      */
     public getServiceInstanceDid(): string {
         return this.serviceInstanceDid;
     }

     public flushDids(appInstanceDId: string, serviceInstanceDid: string): void {
         this.appInstanceDid = appInstanceDId;
         this.serviceInstanceDid = serviceInstanceDid;
     }
 
     public getStorage(): DataStorage {
         return this.dataStorage;
     }
 
     public async refreshAccessToken(): Promise<void> {
         await this.accessToken.fetch();
     }

     public async getNodeVersion(): Promise<NodeVersion> {
        return await this.aboutService.getNodeVersion();
     }

     public async getLatestCommitId(): Promise<string> {
         return await this.aboutService.getCommitId();
     }
}

class BridgeHandlerImpl implements BridgeHandler {
	private static LOG = new Logger("BridgeHandler");

    private ref: ServiceContext;

    constructor(endpoint: ServiceContext) {
        this.ref = endpoint;
    }

    public async flush(value: string): Promise<void> {
        try {
            let endpoint = this.ref;
            let claims: Claims;

            claims = (await new JWTParserBuilder().build().parse(value)).getBody();
            endpoint.flushDids(claims.getAudience(), claims.getIssuer());

        } catch (e) {
            BridgeHandlerImpl.LOG.error("An error occured in the BridgeHandler");
            return;
        }
    }

    public target(): any {
        return this.ref;
    }
}