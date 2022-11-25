import {BasePath, BaseService, GET, Header, Response, ResponseTransformer} from 'ts-retrofit';
import {NotImplementedException} from "../../exceptions";
import {APIResponse} from "../restservice";
import {BackupDetail} from "./backupdetail";
import {FilledOrderDetail} from "./filledorderdetail";
import {VaultDetail} from "./vaultdetail";

@BasePath("/api/v2")
export class ProviderAPI extends BaseService {
    @GET("/provider/vaults")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body['vaults'].map(v => new VaultDetail()
                .setPricingName(v['pricing_using'])
                .setMaxStorage(v['max_storage'])
                .setFileUseStorage(v['file_use_storage'])
                .setDatabaseUseStorage(v['db_use_storage'])
                .setUserDid(v['user_did'])
            );
        });
    })
    async getVaults(@Header("Authorization") auth: string): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/provider/backups")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body['backups'].map(v => new BackupDetail()
                .setPricingName(v['pricing_using'])
                .setMaxStorage(v['max_storage'])
                .setUseStorage(v['use_storage'])
                .setUserDid(v['user_did'])
            );
        });
    })
    async getBackups(@Header("Authorization") auth: string): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/provider/filled_orders")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body["orders"].map(v => new FilledOrderDetail()
                .setOrderId(v['order_id'])
                .setReceiptId(v['receipt_id'])
                .setUserDid(v['user_did'])
                .setSubscription(v['subscription'])
                .setPricingName(v['pricing_name'])
                .setElaAmount(v['ela_amount'])
                .setElaAddress(v['ela_address'])
                .setPaidDid(v['paid_did'])
            );
        });
    })
    async getFilledOrders(@Header("Authorization") auth: string): Promise<Response> {
        throw new NotImplementedException();
    }
}
