import {AppContext} from "../../connection/auth/appcontext";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {VaultDetail} from "./vaultdetail";
import {BackupDetail} from "./backupdetail";
import {FilledOrderDetail} from "./filledorderdetail";
import {RestServiceT} from "../restservice";
import {ProviderAPI} from "./providerapi";

export class Provider extends ServiceEndpoint {
    private restService: RestServiceT<ProviderAPI>;

    constructor(appContext: AppContext, providerAddress?: string) {
        super(appContext, providerAddress);
        this.restService = new RestServiceT<ProviderAPI>(this);
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
