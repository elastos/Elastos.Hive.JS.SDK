package org.elastos.hive.vault.database;

import retrofit2.Call;
import retrofit2.http.*;

interface DatabaseAPI {
	@PUT("/api/v2/vault/db/collections/{collection}")
	Call<CreateCollectionResult> createCollection(@Path("collection") String collection);

	@DELETE("/api/v2/vault/db/{collection}")
	Call<Void> deleteCollection(@Path("collection") String collection);

	@POST("/api/v2/vault/db/collection/{collection}")
	Call<InsertResult> insert(@Path("collection") String collection,
				@Body InsertParams params);

	@PATCH("/api/v2/vault/db/collection/{collection}")
	Call<UpdateResult> update(@Path("collection") String collection,
				@Body UpdateParams params);

	@HTTP(method = "DELETE", path = "/api/v2/vault/db/collection/{collection}", hasBody = true)
	Call<DeleteResult> delete(@Path("collection") String collection,
				@Body DeleteParams params);

	@POST("/api/v2/vault/db/collection/{collection}?op=count")
	Call<CountResult> count(@Path("collection") String collection,
				@Body CountParams params);

	@GET("/api/v2/vault/db/{collection}")
	Call<FindResult> find(@Path("collection") String collection,
				@Query("filter") String filter,
				@Query("skip") String skip,
				@Query("limit") String limit);

	@POST("/api/v2/vault/db/query")
	Call<QueryResult> query(@Body QueryParams params);
}
