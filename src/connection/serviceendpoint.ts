import {File} from '../utils/storage/file'
import {AppContext} from './auth/appcontext'
import {AccessToken} from './auth/accesstoken'
import {DataStorage} from '../utils/storage/datastorage'
import {FileStorage} from '../utils/storage/filestorage'
import {NodeVersion} from '../service/about/nodeversion'
import {HttpClient} from './httpclient'
import {AboutService} from '../service/about/aboutservice'
import {Logger} from '../utils/logger'
import {NodeInfo} from "../service/about/nodeinfo";

export class ServiceEndpoint {
    private readonly context: AppContext;
    private providerAddress: string;
    private aboutService: AboutService;
    private aboutServiceAuth: AboutService;
    private appInstanceDid: string;
    private serviceInstanceDid: string;

    private accessToken: AccessToken;
    private dataStorage: DataStorage;

    private static LOG_SERVICE_CONTEXT = new Logger("ServiceEndpoint");

    constructor(context: AppContext, providerAddress?: string) {
        if (!context && !providerAddress)
            throw new Error('Invalid parameter: context and providerAddress can not all empty');

        this.context = context;  // nullable
        this.providerAddress = providerAddress;

        this.init();
    }

    private init(): void {
        this.aboutService = new AboutService(this, new HttpClient(this, HttpClient.NO_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS));

        if (this.context) {
            let dataDir = this.context.getAppContextProvider().getLocalDataDir();
            if (!dataDir.endsWith(File.SEPARATOR))
                dataDir += File.SEPARATOR;

            this.dataStorage = new FileStorage(dataDir, this.context.getUserDid());
            this.accessToken = new AccessToken(this, this.dataStorage);
            this.aboutServiceAuth = new AboutService(this, new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS));
        }
    }

    hasAppContext(): boolean {
        return this.context != null;
    }

    getAccessToken(): AccessToken {
        if (!this.context)
            throw new Error('AppContext not setup');

        return this.accessToken;
    }

    async getProviderAddress(): Promise<string> {
        if (!this.providerAddress) {
            this.providerAddress = await this.context.getProviderAddress();
        }
        return this.providerAddress;
    }

    getAppContext(): AppContext {
        if (!this.context)
            throw new Error('AppContext not setup');

        return this.context;
    }

    /**
     * Get the user DID string of this ServiceEndpoint.
     *
     * @return user did
     */
    getUserDid(): string {
        if (!this.context)
            throw new Error('AppContext not setup');

        return this.context.getUserDid();
    }

    /**
     * Get the application DID in the current calling context.
     *
     * @return application did
     */
    getAppDid(): string {
        if (!this.context)
            throw new Error('AppContext not setup');

        return this.context.getAppDid();
    }

    /**
     * Get the application instance DID in the current calling context;
     *
     * @return application instance did
     */
    getAppInstanceDid(): string {
        return this.appInstanceDid;
    }

    /**
     * Get the remote node service application DID.
     *
     * @return node service did
     */
    getServiceDid(): string {
        return this.serviceInstanceDid;
    }

    /**
     * Get the remote node service instance DID where is serving the storage service.
     *
     * @return node service instance did
     */
    async getServiceInstanceDid(): Promise<string> {
        if (!this.serviceInstanceDid) {
            if (!this.context)
                throw new Error('AppContext not setup');

            await this.accessToken.fetch();
        }
        return this.serviceInstanceDid;
    }

    flushDids(appInstanceDId: string, serviceInstanceDid: string): void {
        this.appInstanceDid = appInstanceDId;
        this.serviceInstanceDid = serviceInstanceDid;
    }

    getStorage(): DataStorage {
        if (!this.context)
            throw new Error('AppContext not setup');

        return this.dataStorage;
    }

    async getNodeVersion(): Promise<NodeVersion> {
        return await this.aboutService.getNodeVersion();
    }

    async getLatestCommitId(): Promise<string> {
        return await this.aboutService.getCommitId();
    }

    async getNodeInfo(): Promise<NodeInfo> {
        if (!this.context)
            throw new Error('AppContext not setup');

        return await this.aboutServiceAuth.getInfo();
    }
}
