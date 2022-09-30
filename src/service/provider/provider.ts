import {AppContext} from "../../connection/auth/appcontext";
import {HttpClient} from "../../connection/httpclient";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {VaultDetail} from "./vaultdetail";
import {BackupDetail} from "./backupdetail";
import {FilledOrderDetail} from "./filledorderdetail";
import {RestServiceT} from "../restservice";
import {ProviderAPI} from "./providerapi";

export class Provider extends ServiceEndpoint {
    private readonly httpClient: HttpClient;
    private restService: RestServiceT<ProviderAPI>;

    constructor(appContext: AppContext, providerAddress?: string) {
        super(appContext, providerAddress);
        this.httpClient = new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
        this.restService = new RestServiceT<ProviderAPI>(this, this.httpClient);
    }

    async getVaults(): Promise<VaultDetail[]> {
        return await this.restService.callAPI(ProviderAPI, async api => {
            return await api.getVaults(await this.restService.getAccessToken());
        });
    }

    async getBackups(): Promise<BackupDetail[]> {
        return await this.restService.callAPI(ProviderAPI, async api => {
            return await api.getBackups(await this.restService.getAccessToken());
        });
    }

    async getFilledOrders(): Promise<FilledOrderDetail[]> {
        return await this.restService.callAPI(ProviderAPI, async api => {
            return await api.getFilledOrders(await this.restService.getAccessToken());
        });
    }
}
