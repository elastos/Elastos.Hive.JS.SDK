import { Logger } from "../../utils/logger";
import { AppContext } from "../../connection/auth/appcontext";
import { HttpClient } from "../../connection/httpclient";
import { HttpMethod } from "../../connection/httpmethod";
import { HttpResponseParser } from "../../connection/httpresponseparser";
import { ServiceEndpoint } from "../../connection/serviceEndpoint";
import {
    NetworkException,
    NodeRPCException,
} from "../../exceptions";
import {VaultDetail} from "./vaultdetail";
import {BackupDetail} from "./backupdetail";
import {FilledOrderDetail} from "./filledorderdetail";

export class Provider extends ServiceEndpoint {
    private static LOG = new Logger("Provider");

    private static API_ENDPOINT = "/api/v2/provider";
    private httpClient: HttpClient;

    constructor(appContext: AppContext, providerAddress?: string) {
        super(appContext, providerAddress);
        this.httpClient = new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
    }

    public async getVaults(): Promise<VaultDetail[]> {
        try {
            return await this.httpClient.send<VaultDetail[]>(
                `${Provider.API_ENDPOINT}/vaults`, HttpClient.NO_PAYLOAD, <HttpResponseParser<VaultDetail[]>>{
                    deserialize(content: any): VaultDetail[] {
                        return JSON.parse(content)["vaults"].map(v => Object.assign(new VaultDetail(), v));
                    }
                }, HttpMethod.GET);
        } catch (e) {
            Provider.handleError(e);
        }
    }

    public async getBackups(): Promise<BackupDetail[]> {
        try {
            return await this.httpClient.send<BackupDetail[]>(
                `${Provider.API_ENDPOINT}/backups`, HttpClient.NO_PAYLOAD, <HttpResponseParser<BackupDetail[]>>{
                    deserialize(content: any): BackupDetail[] {
                        return JSON.parse(content)["backups"].map(v => Object.assign(new BackupDetail(), v));
                    }
                }, HttpMethod.GET);
        } catch (e) {
            Provider.handleError(e);
        }
    }

    public async getFilledOrders(): Promise<FilledOrderDetail[]> {
        try {
            return await this.httpClient.send<FilledOrderDetail[]>(
                `${Provider.API_ENDPOINT}/filled_orders`, HttpClient.NO_PAYLOAD, <HttpResponseParser<FilledOrderDetail[]>>{
                    deserialize(content: any): FilledOrderDetail[] {
                        return JSON.parse(content)["orders"].map(v => Object.assign(new FilledOrderDetail(), v));
                    }
                }, HttpMethod.GET);
        } catch (e) {
            Provider.handleError(e);
        }
    }

	private static handleError(e: Error): unknown {
		if (e instanceof NodeRPCException) {
			throw e;
		}
		throw new NetworkException(e.message, e);
	}
}
