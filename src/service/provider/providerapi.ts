import {BasePath, BaseService, GET, Header, Response, ResponseTransformer} from 'ts-retrofit';
import {APIResponse} from "../restservice";
import {BackupDetail, FilledOrderDetail, NotImplementedException, VaultDetail} from "../..";

@BasePath("/api/v2")
export class ProviderAPI extends BaseService {
    @GET("/provider/vaults")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj["vaults"].map(v => Object.assign(new VaultDetail(), v));
        });
    })
    async getVaults(@Header("Authorization") auth: string): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/provider/backups")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj["backups"].map(v => Object.assign(new BackupDetail(), v));
        });
    })
    async getBackups(@Header("Authorization") auth: string): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/provider/filled_orders")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj["orders"].map(v => Object.assign(new FilledOrderDetail(), v));
        });
    })
    async getFilledOrders(@Header("Authorization") auth: string): Promise<Response> {
        throw new NotImplementedException();
    }
}
