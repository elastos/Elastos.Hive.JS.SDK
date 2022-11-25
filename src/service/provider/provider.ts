import {AppContext} from "../../connection/auth/appcontext";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {VaultDetail} from "./vaultdetail";
import {BackupDetail} from "./backupdetail";
import {FilledOrderDetail} from "./filledorderdetail";
import {RestServiceT} from "../restservice";
import {ProviderAPI} from "./providerapi";

/**
 * The provider is for the node's owner to get global information about the node.
 */
export class Provider extends ServiceEndpoint {
    private restService: RestServiceT<ProviderAPI>;

    constructor(appContext: AppContext, providerAddress?: string) {
        super(appContext, providerAddress);
        this.restService = new RestServiceT<ProviderAPI>(this);
    }

    /**
     * Get all vaults on the node.
     */
    async getVaults(): Promise<VaultDetail[]> {
        return await this.restService.callAPI(ProviderAPI, async api => {
            return await api.getVaults(await this.restService.getAccessToken());
        });
    }

    /**
     * Get all backup services on the node.
     */
    async getBackups(): Promise<BackupDetail[]> {
        return await this.restService.callAPI(ProviderAPI, async api => {
            return await api.getBackups(await this.restService.getAccessToken());
        });
    }

    /**
     * Get all filled orders on the node.
     */
    async getFilledOrders(): Promise<FilledOrderDetail[]> {
        return await this.restService.callAPI(ProviderAPI, async api => {
            return await api.getFilledOrders(await this.restService.getAccessToken());
        });
    }
}
