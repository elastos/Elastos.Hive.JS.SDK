import { checkNotNull } from '../utils/utils'
import { File } from '../utils/storage/file'
import { AppContext } from './auth/appcontext'
import { AccessToken } from './auth/accesstoken'
import { DataStorage } from '../utils/storage/datastorage'
import { FileStorage } from '../utils/storage/filestorage'
import { NotImplementedException } from '../exceptions'
import { NodeVersion } from '../service/about/nodeversion'
import { HttpClient } from './httpclient'
import { AboutService } from '../service/about/aboutservice'
import { Logger } from '../utils/logger'
import {NodeInfo} from "../service/about/nodeinfo";

export class ServiceEndpoint {
    private readonly context: AppContext;
    private providerAddress: string;
    private aboutService: AboutService;
    private aboutServiceAuth: AboutService;
    private appDid: string;
    private appInstanceDid: string;
    private serviceInstanceDid: string;

    private accessToken: AccessToken;
    private dataStorage: DataStorage;

    private static LOG_SERVICE_CONTEXT = new Logger("ServiceEndpoint");

    constructor(context: AppContext, providerAddress?: string) {
        checkNotNull(context, "Empty context parameter");

        this.context = context;
        this.providerAddress = providerAddress;

        this.init();
    }

    private init(): void {

        let dataDir = this.context.getAppContextProvider().getLocalDataDir();
        if (!dataDir.endsWith(File.SEPARATOR))
            dataDir += File.SEPARATOR;

        //ServiceEndpoint.LOG_SERVICE_CONTEXT.debug("Init Service Context");
        this.dataStorage = new FileStorage(dataDir, this.context.getUserDid());
        this.accessToken = new AccessToken(this, this.dataStorage);
        this.aboutService = new AboutService(this, new HttpClient(this, HttpClient.NO_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS));
        this.aboutServiceAuth = new AboutService(this, new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS));
    }

    public getAccessToken(): AccessToken {
        return this.accessToken;
    }

    public async getProviderAddress(): Promise<string> {
        if (!this.providerAddress) {
            this.providerAddress = await this.context.getProviderAddress();
        }
        return this.providerAddress;
    }

    public getAppContext(): AppContext {
        return this.context;
    }

    /**
     * Get the user DID string of this ServiceEndpoint.
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

    public flushDids(appInstanceDId: string, appDid: string, serviceInstanceDid: string): void {
        this.appInstanceDid = appInstanceDId;
        this.appDid = appDid;
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

    public async getNodeInfo(): Promise<NodeInfo> {
        return await this.aboutServiceAuth.getInfo();
    }
}
