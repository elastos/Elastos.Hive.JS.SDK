import { PricingPlan } from "../../domain/subscription/pricingplan";
import { HttpClient } from "../../http/httpclient";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';
import { RestService } from "../restservice";
import { VaultInfo } from "../../domain/subscription/vaultinfo";
import { BackupInfo } from "../../domain/subscription/backupinfo";
import { HttpResponseParser } from '../../http/httpresponseparser';
import { HttpMethod } from "../../http/httpmethod";

export class SubscriptionService extends RestService {
	private static LOG = new Logger("SubscriptionService");

	private static PRICE_PLANS_ENDPOINT = "/api/v2/subscription/pricing_plan";
	private static SUBSCRIBE_VAULT_ENDPOINT = "/api/v2/subscription/vault";
	private static ACTIVATE_VAULT_ENDPOINT = "/api/v2/subscription/vault?op=activation";
	private static DEACTIVATE_VAULT_ENDPOINT = "/api/v2/subscription/vault?op=deactivation";
	private static UNSUBSCRIBE_VAULT_ENDPOINT = "/api/v2/subscription/vault";
	private static VAULT_INFO_ENDPOINT = "/api/v2/subscription/vault";
	private static SUBSCRIBE_BACKUP_ENDPOINT = "/api/v2/subscription/backup";
	private static ACTIVATE_BACKUP_ENDPOINT = "/api/v2/subscription/backup?op=activation";
	private static DEACTIVATE_BACKUP_ENDPOINT = "/api/v2/subscription/backup?op=deactivation";
	private static UNSUBSCRIBE_BACKUP_ENDPOINT = "/api/v2/subscription/backup";
	private static BACKUP_INFO_ENDPOINT = "/api/v2/subscription/backup";

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}

	/**
	 * Get the pricing plan list of the vault which can be used for upgrading the vault.
	 *
	 * @return The price plan list.
	 * @throws HiveException The error comes from the hive node.
	 */
	 public async getVaultPricingPlanList(): Promise<PricingPlan[]>  {
		return await this.httpClient.send(SubscriptionService.PRICE_PLANS_ENDPOINT, { "subscription":"vault", "name":"" }, <HttpResponseParser<PricingPlan[]>> {
			deserialize(content: any): PricingPlan[] {
				let jsonObj = JSON.parse(content)['pricingPlans'];
				let pricingPlans = [];
				if (!Array.isArray(jsonObj)) {
					return [];
				}
				for (let plan of jsonObj) {
					pricingPlans.push((new PricingPlan()).setAmount(plan["amount"]).setCurrency(plan["currency"]).setMaxStorage(plan["maxStorage"]).setName(plan["name"]).setServiceDays(plan["serviceDays"]));
				}
				return pricingPlans;
			}
		}, HttpMethod.GET);
	}

	/**
	 * Get the pricing plan for the vault by name.
	 *
	 * @param planName The name of the pricing plan.
	 * @return The pricing plan
	 * @throws HiveException The error comes from the hive node.
	 */
	public async getVaultPricingPlan(planName: string): Promise<PricingPlan> {
		return await this.httpClient.send(SubscriptionService.PRICE_PLANS_ENDPOINT, { "subscription":"vault", "name": planName }, <HttpResponseParser<PricingPlan>> {
			deserialize(content: any): PricingPlan {
				let jsonObj = JSON.parse(content)['pricingPlans'];
				let plan = jsonObj[0];
				return (new PricingPlan()).setAmount(plan["amount"]).setCurrency(plan["currency"]).setMaxStorage(plan["maxStorage"]).setName(plan["name"]).setServiceDays(plan["serviceDays"]);
			}
		}, HttpMethod.GET);
	}

	/**
	 * Get the details of the vault.
	 *
	 * @return The details of the vault.
	 * @throws HiveException The error comes from the hive node.
	 */
	public async getVaultInfo(): Promise<VaultInfo> {

		return await this.httpClient.send(SubscriptionService.VAULT_INFO_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<VaultInfo>> {
			deserialize(content: any): VaultInfo {
				let jsonObj = JSON.parse(content);
				return (new VaultInfo()).setServiceDid(jsonObj["service_did"]).setStorageQuota(jsonObj["storage_quota"]).setStorageUsed(jsonObj["storage_used"]).setCreated(new Date(Number(jsonObj["created"]) * 1000)).setUpdated(new Date(Number(jsonObj["updated"]) * 1000)).setPricePlan(jsonObj["price_plan"]);
			}
		}, HttpMethod.GET);
	}

	/**
	 * Subscribe the vault with the free pricing plan.
	 *
	 * <p>TODO: remove the parameter "credential"</p>
	 *
	 * @return The details of the new created vault.
	 * @throws HiveException The error comes from the hive node.
	 */
	public async subscribeToVault(): Promise<VaultInfo> {
		SubscriptionService.LOG.info("Subscribe to vault");
		return await this.httpClient.send(SubscriptionService.SUBSCRIBE_VAULT_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<VaultInfo>> {
			deserialize(content: any): VaultInfo {
				let jsonObj = JSON.parse(content);
				SubscriptionService.LOG.trace(JSON.stringify(jsonObj));
				return (new VaultInfo()).setServiceDid(jsonObj["service_did"]).setStorageQuota(jsonObj["storage_quota"]).setStorageUsed(jsonObj["storage_used"]).setCreated(new Date(Number(jsonObj["created"]) * 1000)).setUpdated(new Date(Number(jsonObj["updated"]) * 1000)).setPricePlan(jsonObj["price_plan"]);
			}
		}, HttpMethod.PUT);
	}

	/**
	 * Unsubscribe the vault.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	public async unsubscribeVault(): Promise<void> {
		return await this.httpClient.send(SubscriptionService.UNSUBSCRIBE_VAULT_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<void>> {
			deserialize(content: any): void {
				return;
			}
		}, HttpMethod.DELETE);
	}

	/**
	 * Activate the vault.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	public async activateVault(): Promise<void> {
		return await this.httpClient.send(SubscriptionService.ACTIVATE_VAULT_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<void>> {
			deserialize(content: any): void {
				return;
			}
		}, HttpMethod.POST);
	}

	/**
	 * Activate the vault.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	public async deactivateVault(): Promise<void> {
		return await this.httpClient.send(SubscriptionService.DEACTIVATE_VAULT_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<void>> {
			deserialize(content: any): void {
				return;
			}
		}, HttpMethod.POST);
	}

	/**
	 * Get the pricing plan list of the backup service which can be used for upgrading the service.
	 *
	 * @return The price plan list.
	 * @throws HiveException The error comes from the hive node.
	 */
	public async getBackupPricingPlanList(): Promise<PricingPlan[]>  {
		return await this.httpClient.send(SubscriptionService.PRICE_PLANS_ENDPOINT, { "subscription":"backup", "name":"" }, <HttpResponseParser<PricingPlan[]>> {
			deserialize(content: any): PricingPlan[] {
				let jsonObj = JSON.parse(content)['backupPlans'];
				let pricingPlans = [];
				for (let plan of jsonObj) {
					pricingPlans.push((new PricingPlan()).setAmount(plan["amount"]).setCurrency(plan["currency"]).setMaxStorage(plan["maxStorage"]).setName(plan["name"]).setServiceDays(plan["serviceDays"]));
				}
				return pricingPlans;
			}
		}, HttpMethod.GET);
	}

	/**
	 * Get the pricing plan for the backup by name.
	 *
	 * @param planName The name of the pricing plan.
	 * @return The pricing plan
	 * @throws HiveException The error comes from the hive node.
	 */
	public async getBackupPricingPlan(planName: string): Promise<PricingPlan> {
		return await this.httpClient.send(SubscriptionService.PRICE_PLANS_ENDPOINT, { "subscription":"backup", "name": planName }, <HttpResponseParser<PricingPlan>> {
			deserialize(content: any): PricingPlan {
				let jsonObj = JSON.parse(content)['backupPlans'];
				let plan = jsonObj[0];
				return (new PricingPlan()).setAmount(plan["amount"]).setCurrency(plan["currency"]).setMaxStorage(plan["maxStorage"]).setName(plan["name"]).setServiceDays(plan["serviceDays"]);
			}
		}, HttpMethod.GET);
	}

	/**
	 * Get the details of the backup service.
	 *
	 * @return The details of the backup service.
	 * @throws HiveException The error comes from the hive node.
	 */
	public async getBackupInfo(): Promise<BackupInfo> {
		return await this.httpClient.send(SubscriptionService.BACKUP_INFO_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<BackupInfo>> {
			deserialize(content: any): BackupInfo {
				let jsonObj = JSON.parse(content);
				return (new BackupInfo()).setServiceDid(jsonObj["service_did"]).setStorageQuota(jsonObj["storage_quota"]).setStorageUsed(jsonObj["storage_used"]).setCreated(new Date(Number(jsonObj["created"]) * 1000)).setUpdated(new Date(Number(jsonObj["updated"]) * 1000)).setPricePlan(jsonObj["price_plan"]);
			}
		}, HttpMethod.GET);
	}

	/**
	 * Subscribe the backup service with the free pricing plan.
	 *
	 * @return The details of the new created backup service.
	 * @throws HiveException The error comes from the hive node.
	 */
	public async subscribeToBackup(): Promise<BackupInfo> {
		return await this.httpClient.send(SubscriptionService.SUBSCRIBE_BACKUP_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<BackupInfo>> {
			deserialize(content: any): BackupInfo {
				let jsonObj = JSON.parse(content);
				return (new BackupInfo()).setServiceDid(jsonObj["service_did"]).setStorageQuota(jsonObj["storage_quota"]).setStorageUsed(jsonObj["storage_used"]).setCreated(new Date(Number(jsonObj["created"]) * 1000)).setUpdated(new Date(Number(jsonObj["updated"]) * 1000)).setPricePlan(jsonObj["price_plan"]);
			}
		}, HttpMethod.PUT);
	}

	/**
	 * Unsubscribe the backup service.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	public async unsubscribeBackup(): Promise<void> {
		return await this.httpClient.send(SubscriptionService.UNSUBSCRIBE_BACKUP_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<void>> {
			deserialize(content: any): void {
				return;
			}
		}, HttpMethod.DELETE);
	}

	/**
	 * Activate the backup.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	public async activateBackup(): Promise<void> {
		return await this.httpClient.send(SubscriptionService.ACTIVATE_BACKUP_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<void>> {
			deserialize(content: any): void {
				return;
			}
		}, HttpMethod.POST);
	}

	/**
	 * Deactivate the backup.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	public async deactivateBackup(): Promise<void> {
		return await this.httpClient.send(SubscriptionService.DEACTIVATE_BACKUP_ENDPOINT, HttpClient.NO_PAYLOAD, <HttpResponseParser<void>> {
			deserialize(content: any): void {
				return;
			}
		}, HttpMethod.POST);
	}
}