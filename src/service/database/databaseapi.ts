import {BasePath, BaseService, Body, DELETE, GET, Header, PATCH, Path, POST, PUT, Query, Response} from 'ts-retrofit';

@BasePath("/api/v2/vault/db")
export class DatabaseAPI extends BaseService {
    @PUT("/collections/{collectionName}")
    async createCollection(@Header("Authorization") authorization: string,
                           @Path('collectionName') collectionName: string): Promise<Response> { return null; }

    @DELETE("/{collectionName}")
    async deleteCollection(@Header("Authorization") authorization: string,
                           @Path('collectionName') collectionName: string): Promise<Response> { return null; }

    @POST("/collection/{collectionName}")
    async insert(@Header("Authorization") authorization: string,
                 @Path('collectionName') collectionName: string,
                 @Body body: object): Promise<Response> { return null; }

    @POST("/collection/{collectionName}?op=count")
    async count(@Header("Authorization") authorization: string,
                @Path('collectionName') collectionName: string,
                @Body body: object): Promise<Response> { return null; }

    @PATCH("/collection/{collectionName}")
    async update(@Header("Authorization") authorization: string,
                 @Path('collectionName') collectionName: string,
                 @Query("updateone") updateOne: boolean,
                 @Body body: object): Promise<Response> { return null; }

    @DELETE("/collection/{collectionName}")
    async delete(@Header("Authorization") authorization: string,
                 @Path('collectionName') collectionName: string,
                 @Query("deleteone") updateOne: boolean,
                 @Body body: object): Promise<Response> { return null; }

    @GET("/{collectionName}")
    async find(@Header("Authorization") authorization: string,
               @Path('collectionName') collectionName: string,
               @Query("filter") filter: string,
               @Query("skip") skip: number,
               @Query("limit") limit: number): Promise<Response> { return null; }

    @POST("/query")
    async query(@Header("Authorization") authorization: string,
                @Path('collectionName') collectionName: string,
                @Body body: object): Promise<Response> { return null; }
}
