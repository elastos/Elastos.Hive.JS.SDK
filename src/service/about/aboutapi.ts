import {BasePath, BaseService, GET, Header, Response} from 'ts-retrofit';

@BasePath("/api/v2")
export class AboutAPI extends BaseService {
    @GET("/node/version")
    async version(): Promise<Response> { return null; }

    @GET("/node/commit_id")
    async commitId(): Promise<Response> { return null; }

    @GET("/node/info")
    async info(@Header("Authorization") authorization: string): Promise<Response> { return null; }
}
