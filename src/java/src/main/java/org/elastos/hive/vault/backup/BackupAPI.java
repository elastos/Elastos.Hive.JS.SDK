package org.elastos.hive.vault.backup;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;

interface BackupAPI {
	@GET("/api/v2/vault/content")
	Call<BackupResult> getState();

	@POST("/api/v2/vault/content?to=hive_node")
	Call<Void> saveToNode(@Body RequestParams params);

	@POST("/api/v2/vault/content?from=hive_node")
	Call<Void> restoreFromNode(@Body RequestParams params);
}
