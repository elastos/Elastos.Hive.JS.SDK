import {BasePath, BaseService, DELETE, GET, Header, POST, PUT, Query, Response, ResponseTransformer} from 'ts-retrofit';
import {NotImplementedException} from "../../exceptions";
import {APIResponse} from "../restservice";
import {AppInfo} from "./appinfo";
import {BackupInfo} from "./backupinfo";
import {PricingPlan} from "./pricingplan";
import {VaultInfo} from "./vaultinfo";

@BasePath("/api/v2")
export class SubscriptionAPI extends BaseService {
    @GET("/subscription/pricing_plan")
    @ResponseTransformer((data: any, _headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body['pricingPlans'].map((plan: any) => {
                return new PricingPlan().setAmount(plan["amount"])
                    .setCurrency(plan["currency"])
                    .setMaxStorage(plan["maxStorage"])
                    .setName(plan["name"])
                    .setServiceDays(plan["serviceDays"]);
            });
        });
    })
    async getVaultPricePlans(
        @Header("Authorization") _auth: string,
        @Query('subscription') _subscription?: string,
        @Query('name') _name?: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/subscription/pricing_plan")
    @ResponseTransformer((data: any, _headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body['backupPlans'].map((plan: any) => {
                return new PricingPlan().setAmount(plan["amount"])
                    .setCurrency(plan["currency"])
                    .setMaxStorage(plan["maxStorage"])
                    .setName(plan["name"])
                    .setServiceDays(plan["serviceDays"]);
            });
        });
    })
    async getBackupPricePlans(
        @Header("Authorization") _auth: string,
        @Query('subscription') _subscription?: string,
        @Query('name') _name?: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @PUT("/subscription/vault")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body: any) => {
            return new VaultInfo()
                .setAppCount(body["app_count"])
                .setAccessCount(body["access_count"])
                .setAccessAmount(body["access_amount"])
                .setAccessLastTime(body["access_last_time"])
                .setServiceDid(body["service_did"])
                .setStorageQuota(body["storage_quota"])
                .setStorageUsed(body["storage_used"])
                .setCreated(new Date(Number(body["created"]) * 1000))
                .setUpdated(new Date(Number(body["updated"]) * 1000))
                .setPricePlan(body["pricing_plan"]);
        });
    })
    async subscribeToVault(
        @Header("Authorization") _auth: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @POST("/subscription/vault?op=activation")
    async activateVault(
        @Header("Authorization") _auth: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @POST("/subscription/vault?op=deactivation")
    async deactivateVault(
        @Header("Authorization") _auth: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @DELETE("/subscription/vault")
    async unsubscribeVault(
        @Header("Authorization") _auth: string,
        @Query('force') _force: boolean
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/subscription/vault")
    @ResponseTransformer((data: any, _headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            const accessLastTime = body["access_last_time"] == -1 ? null
                : new Date(Number(body["access_last_time"]) * 1000);
            return new VaultInfo()
                .setAppCount(body["app_count"])
                .setAccessCount(body['access_count'])
                .setAccessAmount(body['access_amount'])
                .setAccessLastTime(accessLastTime)
                .setServiceDid(body["service_did"])
                .setStorageQuota(body["storage_quota"])
                .setStorageUsed(body["storage_used"])
                .setStartTime(new Date(Number(body["start_time"]) * 1000))
                .setEndTime(body["end_time"] > 0 ? new Date(Number(body["end_time"]) * 1000) : null)
                .setCreated(new Date(Number(body["created"]) * 1000))
                .setUpdated(new Date(Number(body["updated"]) * 1000))
                .setPricePlan(body["pricing_plan"]);
        });
    })
    async getVaultInfo(
        @Header("Authorization") _auth: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/subscription/vault/app_stats")
    @ResponseTransformer((data: any, _headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body["apps"].map(v => {
                const access_last_time =
                    v['access_last_time'] == -1 ? null : new Date(body["access_last_time"] * 1000);
                return new AppInfo()
                    .setName(v['name'])
                    .setDeveloperDid(v['developer_did'])
                    .setIconUrl(v['icon_url'])
                    .setUserDid(v['user_did'])
                    .setAppDid(v['app_did'])
                    .setUsedStorageSize(v['used_storage_size'])
                    .setAccessAccount(v['access_count'])
                    .setAccessAmount(v['access_amount'])
                    .setAccessLastTime(access_last_time);
            });
        });
    })
    async getVaultAppStats(
        @Header("Authorization") _auth: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @PUT("/subscription/backup")
    @ResponseTransformer((data: any, _headers?: any) => {
        return APIResponse.handleResponseData(data, (body) =>
            new BackupInfo().setServiceDid(body["service_did"])
                .setStorageQuota(body["storage_quota"])
                .setStorageUsed(body["storage_used"])
                .setCreated(new Date(Number(body["created"]) * 1000))
                .setUpdated(new Date(Number(body["updated"]) * 1000))
                .setPricePlan(body["pricing_plan"])
        );
    })
    async subscribeToBackup(
        @Header("Authorization") auth: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @POST("/subscription/backup?op=activation")
    async activateBackup(
        @Header("Authorization") _auth: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @POST("/subscription/backup?op=deactivation")
    async deactivateBackup(
        @Header("Authorization") _auth: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @DELETE("/subscription/backup")
    async unsubscribeBackup(
        @Header("Authorization") _auth: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/subscription/backup")
    @ResponseTransformer((data: any, _headers?: any) => {
        return APIResponse.handleResponseData(data, (body) =>
            new BackupInfo().setServiceDid(body["service_did"])
                .setStorageQuota(body["storage_quota"])
                .setStorageUsed(body["storage_used"])
                .setStartTime(new Date(Number(body["start_time"]) * 1000))
                .setEndTime(body["start_time"] > 0 ? new Date(Number(body["start_time"]) * 1000) : null)
                .setCreated(new Date(Number(body["created"]) * 1000))
                .setUpdated(new Date(Number(body["updated"]) * 1000))
                .setPricePlan(body["pricing_plan"])
        )
    })
    async getBackupInfo(
        @Header("Authorization") _auth: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }
}
