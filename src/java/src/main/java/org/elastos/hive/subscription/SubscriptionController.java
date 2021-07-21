package org.elastos.hive.subscription;

import org.elastos.hive.connection.NodeRPCConnection;
import org.elastos.hive.connection.NodeRPCException;
import org.elastos.hive.exception.*;

import java.io.IOException;
import java.util.List;

public class SubscriptionController {
	private final SubscriptionAPI subscriptionAPI;

	public SubscriptionController(NodeRPCConnection connection) {
		this.subscriptionAPI = connection.createService(SubscriptionAPI.class, true);
	}

	public List<PricingPlan> getVaultPricingPlanList() throws HiveException {
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
	}

	public PricingPlan getVaultPricingPlan(String planName) throws HiveException {
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
	}

	public VaultInfo getVaultInfo() throws HiveException {
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
	}

	public VaultInfo subscribeToVault(String credential) throws HiveException {
		if (credential != null)
			throw new NotImplementedException();

		try {
			return subscriptionAPI.subscribeToVault(credential).execute().body();
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
	}

	public void unsubscribeVault() throws HiveException {
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
	}

	public List<PricingPlan> getBackupPricingPlanList() throws HiveException {
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
	}

	public PricingPlan getBackupPricingPlan(String planName) throws HiveException {
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
	}

	public BackupInfo getBackupInfo() throws HiveException {
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
	}

	public BackupInfo subscribeToBackup(String reserved) throws HiveException {
		try {
			return subscriptionAPI.subscribeToBackup(reserved).execute().body();
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
	}

	public void unsubscribeBackup() throws HiveException {
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
	}
}
