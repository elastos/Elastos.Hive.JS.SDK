package org.elastos.hive.subscription;

import retrofit2.Call;
import retrofit2.http.*;

interface SubscriptionAPI {
	@GET("/api/v2/subscription/pricing_plan")
	Call<PricingPlanCollection> getPricePlans(@Query("subscription") String subscription, @Query("name") String name);

	// for subscription to vault service.
	@PUT("/api/v2/subscription/vault")
	Call<VaultInfo> subscribeToVault(@Query("credential") String credential);

	@POST("/api/v2/subscription/vault?op=activation")
	Call<Void> activateVault();

	@POST("/api/v2/subscription/vault?op=deactivation")
	Call<Void> deactivateVault();

	@DELETE("/api/v2/subscription/vault")
	Call<Void> unsubscribeVault();

	@GET("/api/v2/subscription/vault")
	Call<VaultInfo> getVaultInfo();

	// for subscription to backup service.
	@PUT("/api/v2/subscription/backup")
	Call<BackupInfo> subscribeToBackup(@Query("credential") String credential);

	@POST("/api/v2/subscription/backup?op=activation")
	Call<Void> activateBackup();

	@POST("/api/v2/subscription/backup?op=deactivation")
	Call<Void> deactivateBackup();

	@DELETE("/api/v2/subscription/backup")
	Call<Void> unsubscribeBackup();

	@GET("/api/v2/subscription/backup")
	Call<BackupInfo> getBackupInfo();
}
