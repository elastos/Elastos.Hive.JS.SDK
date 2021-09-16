import { PricingPlan } from "../../domain/subscription/pricingplan";
import { HttpClient } from "../../http/httpclient";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';
import { RestService } from "../restservice";
import { VaultInfo } from "../../domain/subscription/vaultinfo";
import { BackupInfo } from "../../domain/subscription/backupinfo";

export class SubscriptionService extends RestService {
	private static LOG = new Logger("SubscriptionService");

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
		return await new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});	
/*
	
		try {
			return subscriptionAPI.getPricePlans("vault", "")
					.execute()
					.body()
					.getPricingPlanCollection();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.NOT_FOUND:
					throw new PricingPlanNotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
*/
	}

	/**
	 * Get the pricing plan for the vault by name.
	 *
	 * @param planName The name of the pricing plan.
	 * @return The pricing plan
	 * @throws HiveException The error comes from the hive node.
	 */
	public async getVaultPricingPlan(planName: string): Promise<PricingPlan> {
		return await new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*
		try {
			return subscriptionAPI.getPricePlans("vault", planName)
								.execute()
								.body()
								.getPricingPlanCollection().get(0);
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
			case NodeRPCException.UNAUTHORIZED:
				throw new UnauthorizedException(e);
			case NodeRPCException.NOT_FOUND:
				throw new PricingPlanNotFoundException(e);
			default:
				throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e.getMessage());
		}
*/
	}

	/**
	 * Get the details of the vault.
	 *
	 * @return The details of the vault.
	 * @throws HiveException The error comes from the hive node.
	 */
	public async getVaultInfo(): Promise<VaultInfo> {
		return await new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*
		try {
			return subscriptionAPI.getVaultInfo().execute().body();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
			case NodeRPCException.UNAUTHORIZED:
				throw new UnauthorizedException(e);
			case NodeRPCException.NOT_FOUND:
				throw new VaultNotFoundException(e);
			default:
				throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e.getMessage());
		}
*/
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
		return await new Promise<VaultInfo>((resolve, reject)=>{
			try {
				resolve(new VaultInfo());
			} catch (e) {
				reject(e);
			}
		});
/*
		try {
			return subscriptionAPI.subscribeToVault().execute().body();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.ALREADY_EXISTS:
					throw new AlreadyExistsException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
*/
	}

	/**
	 * Unsubscribe the vault.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	public async unsubscribeVault(): Promise<void> {
		return void await new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*
		try {
			subscriptionAPI.unsubscribeVault().execute();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException();
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
*/
	}

	/**
	 * Get the pricing plan list of the backup service which can be used for upgrading the service.
	 *
	 * @return The price plan list.
	 * @throws HiveException The error comes from the hive node.
	 */
	public getBackupPricingPlanList(): Promise<PricingPlan[]> {
		return new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*		
		try {
			return subscriptionAPI.getPricePlans("backup", "")
					.execute()
					.body()
					.getBackupPlans();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.NOT_FOUND:
					throw new PricingPlanNotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
*/
	}

	/**
	 * Get the pricing plan for the backup by name.
	 *
	 * @param planName The name of the pricing plan.
	 * @return The pricing plan
	 * @throws HiveException The error comes from the hive node.
	 */
	public getBackupPricingPlan(planName: string): Promise<PricingPlan> {
		return new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*
		try {
			return subscriptionAPI.getPricePlans("backup", planName).execute()
					.body().getBackupPlans().get(0);
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.NOT_FOUND:
					throw new PricingPlanNotFoundException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
*/
	}

	/**
	 * Get the details of the backup service.
	 *
	 * @return The details of the backup service.
	 * @throws HiveException The error comes from the hive node.
	 */
	public getBackupInfo(): Promise<BackupInfo> {
		return new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*
		try {
	   	 	return subscriptionAPI.getBackupInfo().execute().body();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
			case NodeRPCException.UNAUTHORIZED:
				throw new UnauthorizedException(e);
			case NodeRPCException.NOT_FOUND:
				throw new BackupNotFoundException(e);
			default:
				throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
*/
	}

	/**
	 * Subscribe the backup service with the free pricing plan.
	 *
	 * @return The details of the new created backup service.
	 * @throws HiveException The error comes from the hive node.
	 */
	public subscribeToBackup(): Promise<BackupInfo> {
		return new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*
		try {
			return subscriptionAPI.subscribeToBackup().execute().body();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException(e);
				case NodeRPCException.ALREADY_EXISTS:
					throw new AlreadyExistsException(e);
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
*/
	}

	/**
	 * Unsubscribe the backup service.
	 *
	 * @throws HiveException The error comes from the hive node.
	 */
	public unsubscribeBackup(): Promise<void> {
		return new Promise((resolve, reject)=>{
			try {
				resolve(null);
			} catch (e) {
				reject(e);
			}
		});
/*
		try {
			subscriptionAPI.unsubscribeBackup().execute();
		} catch (NodeRPCException e) {
			switch (e.getCode()) {
				case NodeRPCException.UNAUTHORIZED:
					throw new UnauthorizedException();
				default:
					throw new ServerUnknownException(e);
			}
		} catch (IOException e) {
			throw new NetworkException(e);
		}
*/
	}
}