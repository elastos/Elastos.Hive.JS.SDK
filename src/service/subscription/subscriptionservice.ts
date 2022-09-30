import {PricingPlan} from "./pricingplan";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {RestServiceT} from "../restservice";
import {VaultInfo} from "./vaultinfo";
import {BackupInfo} from "./backupinfo";
import {AppInfo} from "./appinfo";
import {SubscriptionAPI} from "./subscriptionapi";
import {checkArgument} from "../../utils/utils";

export class SubscriptionService extends RestServiceT<SubscriptionAPI> {
    constructor(serviceContext: ServiceEndpoint) {
		super(serviceContext);
	}

	/**
	 * Get the pricing plan list of the vault which can be used for upgrading the vault.
	 *
	 * @return The price plan list.
	 * @throws HiveException The error comes from the hive node.
	 */
	 async getVaultPricingPlanList(): Promise<PricingPlan[]>  {
        return this.callAPI(SubscriptionAPI, async api => {
            return await api.getVaultPricePlans(await this.getAccessToken(), 'vault');
        });
	}

	/**
	 * Get the pricing plan for the vault by name.
	 *
	 * @param planName The name of the pricing plan.
	 * @return The pricing plan
	 * @throws HiveException The error comes from the hive node.
	 */
	async getVaultPricingPlan(planName: string): Promise<PricingPlan> {
	    checkArgument(!!planName, 'Invalid plan name.');
        const plans = await this.callAPI(SubscriptionAPI, async api => {
            return await api.getVaultPricePlans(await this.getAccessToken(), 'vault', planName);
        });
        return plans ? plans[0] : null;
	}

	/**
	 * Get the details of the vault.
	 *
	 * @return The details of the vault.
	 * @throws HiveException The error comes from the hive node.
	 */
	async getVaultInfo(): Promise<VaultInfo> {
	    return await this.callAPI(SubscriptionAPI, async api => {
            return await api.getVaultInfo(await this.getAccessToken());
        });
	}

	/**
	 * Get the details of the vault applications.
	 *
	 * @return The details of the vault applications.
	 * @throws HiveException The error comes from the hive node.
	 */
	async getAppStats(): Promise<AppInfo[]> {
        return await this.callAPI(SubscriptionAPI, async api => {
            return await api.getVaultAppStats(await this.getAccessToken());
        });
	}

	/**
	 * Subscribe the vault with the free pricing plan.
	 *
	 * <p>TODO: remove the parameter "credential"</p>
	 *
	 * @return The details of the new created vault.
	 * @throws HiveException The error comes from the hive node.
	 */
	async subscribeToVault(): Promise<VaultInfo> {
        return await this.callAPI(SubscriptionAPI, async api => {
            return await api.subscribeToVault(await this.getAccessToken());
        });
	}

	/**
	 * Unsubscribe the vault.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	async unsubscribeVault(): Promise<void> {
        return await this.callAPI(SubscriptionAPI, async api => {
            return await api.unsubscribeVault(await this.getAccessToken());
        });
	}

	/**
	 * Activate the vault.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	async activateVault(): Promise<void> {
        return await this.callAPI(SubscriptionAPI, async api => {
            return await api.activateVault(await this.getAccessToken());
        });
	}

	/**
	 * Activate the vault.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	async deactivateVault(): Promise<void> {
        return await this.callAPI(SubscriptionAPI, async api => {
            return await api.deactivateVault(await this.getAccessToken());
        });
	}

	/**
	 * Get the pricing plan list of the backup service which can be used for upgrading the service.
	 *
	 * @return The price plan list.
	 * @throws HiveException The error comes from the hive node.
	 */
	async getBackupPricingPlanList(): Promise<PricingPlan[]>  {
        return await this.callAPI(SubscriptionAPI, async api => {
            return await api.getBackupPricePlans(await this.getAccessToken(), 'backup');
        });
	}

	/**
	 * Get the pricing plan for the backup by name.
	 *
	 * @param planName The name of the pricing plan.
	 * @return The pricing plan
	 * @throws HiveException The error comes from the hive node.
	 */
	async getBackupPricingPlan(planName: string): Promise<PricingPlan> {
	    checkArgument(!!planName, 'Invalid plan name.');
        const plans = await this.callAPI(SubscriptionAPI, async api => {
            return await api.getBackupPricePlans(await this.getAccessToken(), 'backup', planName);
        });
        return plans ? plans[0] : null;
	}

	/**
	 * Get the details of the backup service.
	 *
	 * @return The details of the backup service.
	 * @throws HiveException The error comes from the hive node.
	 */
	async getBackupInfo(): Promise<BackupInfo> {
        return await this.callAPI(SubscriptionAPI, async api => {
            return await api.getBackupInfo(await this.getAccessToken());
        });
	}

	/**
	 * Subscribe the backup service with the free pricing plan.
	 *
	 * @return The details of the new created backup service.
	 * @throws HiveException The error comes from the hive node.
	 */
	async subscribeToBackup(): Promise<BackupInfo> {
        return await this.callAPI(SubscriptionAPI, async api => {
            return await api.subscribeToBackup(await this.getAccessToken());
        });
	}

	/**
	 * Unsubscribe the backup service.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	async unsubscribeBackup(): Promise<void> {
        return await this.callAPI(SubscriptionAPI, async api => {
            return await api.unsubscribeBackup(await this.getAccessToken());
        });
	}

	/**
	 * Activate the backup.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	async activateBackup(): Promise<void> {
        return await this.callAPI(SubscriptionAPI, async api => {
            return await api.activateBackup(await this.getAccessToken());
        });
	}

	/**
	 * Deactivate the backup.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	async deactivateBackup(): Promise<void> {
        return await this.callAPI(SubscriptionAPI, async api => {
            return await api.deactivateBackup(await this.getAccessToken());
        });
	}
}