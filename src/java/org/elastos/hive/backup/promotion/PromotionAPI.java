package org.elastos.hive.backup.promotion;

import retrofit2.Call;
import retrofit2.http.POST;

interface PromotionAPI {
	@POST("/api/v2/backup/promotion")
	Call<Void> promoteToVault();
}
