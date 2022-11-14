import {BasePath, BaseService, DELETE, GET, Header, POST, PUT, Query, Response, ResponseTransformer} from 'ts-retrofit';
import {APIResponse} from "../restservice";
import {AppInfo, BackupInfo, NotImplementedException, PricingPlan, VaultInfo} from "../..";

@BasePath("/api/v2")
export class SubscriptionAPI extends BaseService {
    @GET("/subscription/pricing_plan")
    @ResponseTransformer((data: any, _headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            const plans = jsonObj['pricingPlans'];
            return plans.map((plan: any) => {
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
        return APIResponse.handleResponseData(data, (jsonObj) => {
            const plans = jsonObj['backupPlans'];
            return plans.map((plan: any) => {
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
        return APIResponse.handleResponseData(data, (jsonObj: any) => {
            return new VaultInfo()
                .setAppCount(jsonObj["app_count"])
                .setAccessCount(jsonObj["access_count"])
                .setAccessAmount(jsonObj["access_amount"])
                .setAccessLastTime(jsonObj["access_last_time"])
                .setServiceDid(jsonObj["service_did"])
                .setStorageQuota(jsonObj["storage_quota"])
                .setStorageUsed(jsonObj["storage_used"])
                .setCreated(new Date(Number(jsonObj["created"]) * 1000))
                .setUpdated(new Date(Number(jsonObj["updated"]) * 1000))
                .setPricePlan(jsonObj["pricing_plan"]);
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
        return APIResponse.handleResponseData(data, (jsonObj) => {
            const accessLastTime = jsonObj["access_last_time"] == -1 ? null
                : new Date(Number(jsonObj["access_last_time"]) * 1000);
            return new VaultInfo()
                .setAppCount(jsonObj["app_count"])
                .setAccessCount(jsonObj['access_count'])
                .setAccessAmount(jsonObj['access_amount'])
                .setAccessLastTime(accessLastTime)
                .setServiceDid(jsonObj["service_did"])
                .setStorageQuota(jsonObj["storage_quota"])
                .setStorageUsed(jsonObj["storage_used"])
                .setStartTime(new Date(Number(jsonObj["start_time"]) * 1000))
                .setEndTime(jsonObj["end_time"] > 0 ? new Date(Number(jsonObj["end_time"]) * 1000) : null)
                .setCreated(new Date(Number(jsonObj["created"]) * 1000))
                .setUpdated(new Date(Number(jsonObj["updated"]) * 1000))
                .setPricePlan(jsonObj["pricing_plan"]);
        });
    })
    async getVaultInfo(
        @Header("Authorization") _auth: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/subscription/vault/app_stats")
    @ResponseTransformer((data: any, _headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj["apps"].map(v => {
                v['access_last_time'] =
                    v['access_last_time'] == -1 ? null : new Date(jsonObj["access_last_time"] * 1000);
                return Object.assign(new AppInfo(), v);
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
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return new BackupInfo().setServiceDid(jsonObj["service_did"])
                .setStorageQuota(jsonObj["storage_quota"])
                .setStorageUsed(jsonObj["storage_used"])
                .setCreated(new Date(Number(jsonObj["created"]) * 1000))
                .setUpdated(new Date(Number(jsonObj["updated"]) * 1000))
                .setPricePlan(jsonObj["pricing_plan"]);
        });
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
    async getBackupInfo(
        @Header("Authorization") _auth: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }
}
