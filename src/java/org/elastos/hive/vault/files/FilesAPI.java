package org.elastos.hive.vault.files;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.*;

interface FilesAPI {
	String API_UPLOAD = "/api/v2/vault/files/";

	@GET("/api/v2/vault/files/{path}")
	Call<ResponseBody> download(@Path("path") String path);

	@GET("/api/v2/vault/files/{path}?comp=children")
	Call<ChildrenInfo> listChildren(@Path("path") String path);

	@GET("/api/v2/vault/files/{path}?comp=metadata")
	Call<FileInfo> getMetadata(@Path("path") String path);

	@GET("/api/v2/vault/files/{path}?comp=hash")
	Call<HashInfo> getHash(@Path("path") String path);

	@PUT("/api/v2/vault/files/{path}")
	Call<GeneralResult> copy(@Path("path") String src, @Query("dest") String dest);

	@PATCH("/api/v2/vault/files/{path}")
	Call<GeneralResult> move(@Path("path") String src, @Query("to") String to);

	@DELETE("/api/v2/vault/files/{path}")
	Call<Void> delete(@Path("path") String path);
}
