import {Logger} from "../../logger";
import {AppContext, HttpClient, HttpMethod, HttpResponseParser, NotFoundException, ServiceContext} from "../..";
import {
    InvalidParameterException,
    NetworkException,
    NodeRPCException,
    ServerUnknownException,
    UnauthorizedException
} from "../../exceptions";
import {VaultDetail} from "./vaultdetail";
import {BackupDetail} from "./backupdetail";
import {FilledOrderDetail} from "./filledorderdetail";


export class ProviderService extends ServiceContext {
    private static LOG = new Logger("ProviderService");

    private static API_ENDPOINT = "/api/v2/provider";
    private httpClient: HttpClient;

    constructor(appContext: AppContext, providerAddress: string) {
        super(appContext, providerAddress);
        this.httpClient = new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
    }

    public async getVaults(): Promise<VaultDetail[]> {
        try {
            return await this.httpClient.send<VaultDetail[]>(
                `${ProviderService.API_ENDPOINT}/vaults`, HttpClient.NO_PAYLOAD, <HttpResponseParser<VaultDetail[]>>{
                    deserialize(content: any): VaultDetail[] {
                        return JSON.parse(content)["vaults"].map(v => Object.assign(new VaultDetail(), v));
                    }
                }, HttpMethod.GET);
        } catch (e) {
            ProviderService.handleError(e);
        }
    }

    public async getBackups(): Promise<BackupDetail[]> {
        try {
            return await this.httpClient.send<BackupDetail[]>(
                `${ProviderService.API_ENDPOINT}/backups`, HttpClient.NO_PAYLOAD, <HttpResponseParser<BackupDetail[]>>{
                    deserialize(content: any): BackupDetail[] {
                        return JSON.parse(content)["backups"].map(v => Object.assign(new BackupDetail(), v));
                    }
                }, HttpMethod.GET);
        } catch (e) {
            ProviderService.handleError(e);
        }
    }

    public async getFilledOrders(): Promise<FilledOrderDetail[]> {
        try {
            return await this.httpClient.send<FilledOrderDetail[]>(
                `${ProviderService.API_ENDPOINT}/filled_orders`, HttpClient.NO_PAYLOAD, <HttpResponseParser<FilledOrderDetail[]>>{
                    deserialize(content: any): FilledOrderDetail[] {
                        return JSON.parse(content)["orders"].map(v => Object.assign(new FilledOrderDetail(), v));
                    }
                }, HttpMethod.GET);
        } catch (e) {
            ProviderService.handleError(e);
        }
    }

    private static handleError(e: Error): unknown {
        if (e instanceof NodeRPCException) {
            switch (e.getCode()) {
                case NodeRPCException.UNAUTHORIZED:
                    throw new UnauthorizedException(e.message, e);
                case NodeRPCException.BAD_REQUEST:
                    throw new InvalidParameterException(e.message, e);
                case NodeRPCException.NOT_FOUND:
                    throw new NotFoundException(e.message, e);
                default:
                    throw new ServerUnknownException(NodeRPCException.SERVER_EXCEPTION, e.message, e);
            }
        }
        throw new NetworkException(e.message, e);
    }
}
