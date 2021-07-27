package org.elastos.hive.endpoint;

import retrofit2.Call;
import retrofit2.http.GET;

interface AboutAPI {
	@GET("/api/v2/about/version")
	Call<NodeVersion> version();

	@GET("/api/v2/about/commit_id")
	Call<CommitHash> commitId();
}
