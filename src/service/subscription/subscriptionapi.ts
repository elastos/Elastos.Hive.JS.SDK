import {BasePath, BaseService, DELETE, GET, Header, POST, PUT, Query, Response, ResponseTransformer} from 'ts-retrofit';
import {APIResponse} from "../restservice";
import {AppInfo, BackupInfo, PricingPlan, VaultInfo} from "../..";

@BasePath("/api/v2")
export class SubscriptionAPI extends BaseService {
    @GET("/subscription/pricing_plan")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            const plans = jsonObj['pricingPlans'];
            return plans.map(plan => {
                return new PricingPlan().setAmount(plan["amount"])
                    .setCurrency(plan["currency"])
                    .setMaxStorage(plan["maxStorage"])
                    .setName(plan["name"])
                    .setServiceDays(plan["serviceDays"]);
            });
        });
    })
    async getPricePlans(@Header("Authorization") auth: string,
                        @Query('subscription') subscription?: string,
                        @Query('name') name?: string): Promise<Response> { return null; }

    @PUT("/subscription/vault")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return new VaultInfo().setServiceDid(jsonObj["service_did"])
                .setStorageQuota(jsonObj["storage_quota"])
                .setStorageUsed(jsonObj["storage_used"])
                .setCreated(new Date(Number(jsonObj["created"]) * 1000))
                .setUpdated(new Date(Number(jsonObj["updated"]) * 1000))
                .setPricePlan(jsonObj["pricing_plan"]);
        });
    })
    async subscribeToVault(@Header("Authorization") auth: string): Promise<Response> { return null; }

    @POST("/subscription/vault?op=activation")
    async activateVault(@Header("Authorization") auth: string): Promise<Response> { return null; }

    @POST("/subscription/vault?op=deactivation")
    async deactivateVault(@Header("Authorization") auth: string): Promise<Response> { return null; }

    @DELETE("/subscription/vault")
    async unsubscribeVault(@Header("Authorization") auth: string): Promise<Response> { return null; }

    @GET("/subscription/vault")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return new VaultInfo().setServiceDid(jsonObj["service_did"])
                .setStorageQuota(jsonObj["storage_quota"])
                .setStorageUsed(jsonObj["storage_used"])
                .setStartTime(new Date(Number(jsonObj["start_time"]) * 1000))
                .setEndTime(jsonObj["end_time"] > 0 ? new Date(Number(jsonObj["end_time"]) * 1000) : null)
                .setCreated(new Date(Number(jsonObj["created"]) * 1000))
                .setUpdated(new Date(Number(jsonObj["updated"]) * 1000))
                .setPricePlan(jsonObj["pricing_plan"]);
        });
    })
    async getVaultInfo(@Header("Authorization") auth: string): Promise<Response> { return null; }

    @GET("/subscription/vault/app_stats")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj["apps"].map(v => Object.assign(new AppInfo(), v));
        });
    })
    async getVaultAppStats(@Header("Authorization") auth: string): Promise<Response> { return null; }

    @PUT("/subscription/backup")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return new BackupInfo().setServiceDid(jsonObj["service_did"])
                .setStorageQuota(jsonObj["storage_quota"])
                .setStorageUsed(jsonObj["storage_used"])
                .setCreated(new Date(Number(jsonObj["created"]) * 1000))
                .setUpdated(new Date(Number(jsonObj["updated"]) * 1000))
                .setPricePlan(jsonObj["pricing_plan"]);
        });
    })
    async subscribeToBackup(@Header("Authorization") auth: string): Promise<Response> { return null; }

    @POST("/subscription/backup?op=activation")
    async activateBackup(@Header("Authorization") auth: string): Promise<Response> { return null; }

    @POST("/subscription/backup?op=deactivation")
    async deactivateBackup(@Header("Authorization") auth: string): Promise<Response> { return null; }

    @DELETE("/subscription/backup")
    async unsubscribeBackup(@Header("Authorization") auth: string): Promise<Response> { return null; }

    @GET("/subscription/backup")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return new BackupInfo().setServiceDid(jsonObj["service_did"])
                .setStorageQuota(jsonObj["storage_quota"])
                .setStorageUsed(jsonObj["storage_used"])
                .setStartTime(new Date(Number(jsonObj["start_time"]) * 1000))
                .setEndTime(jsonObj["start_time"] > 0 ? new Date(Number(jsonObj["start_time"]) * 1000) : null)
                .setCreated(new Date(Number(jsonObj["created"]) * 1000))
                .setUpdated(new Date(Number(jsonObj["updated"]) * 1000))
                .setPricePlan(jsonObj["pricing_plan"]);
        });
    })
    async getBackupInfo(@Header("Authorization") auth: string): Promise<Response> { return null; }
}
