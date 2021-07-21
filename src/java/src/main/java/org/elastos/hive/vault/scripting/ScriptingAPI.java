package org.elastos.hive.vault.scripting;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.*;

interface ScriptingAPI {
	String API_SCRIPT_UPLOAD = "/api/v2/vault/scripting/stream";

	@PUT("/api/v2/vault/scripting/{scriptName}")
	Call<RegScriptResult> registerScript(@Path("scriptName") String name,
										 @Body RegScriptParams body);

	@PATCH("/api/v2/vault/scripting/{scriptName}")
	Call<ResponseBody> runScript(@Path("scriptName") String scriptName,
								 @Body RunScriptParams body);

	@GET("/api/v2/vault/scripting/{scriptName}/{targetDid}@{targetAppDid}/{params}")
	Call<ResponseBody> runScriptUrl(@Path("scriptName") String scriptName,
									@Path("targetDid") String targetDid,
									@Path("targetAppDid") String targetAppDid,
									@Path("params") String params);

	@GET("/api/v2/vault/scripting/stream/{transactionId}")
	Call<ResponseBody> downloadFile(@Path("transactionId") String transactionId);

	@DELETE("/api/v2/vault/scripting/{scriptName}")
	Call<Void> unregisterScript(@Path("scriptName") String scriptName);
}
