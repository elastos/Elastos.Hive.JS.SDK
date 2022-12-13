import {
    BasePath,
    BaseService,
    Body,
    DELETE,
    GET,
    Header,
    PATCH,
    Path,
    POST,
    PUT,
    Query,
    Response,
    ResponseTransformer
} from 'ts-retrofit';
import {NotImplementedException} from "../../exceptions";
import {InsertResult} from "./insertresult";
import {UpdateResult} from "./updateresult";
import {APIResponse} from "../restservice";
import {FindResult} from "./findresult";
import {Collection} from "./collection";
import {QueryResult} from "./queryresult";

@BasePath("/api/v2/vault/db")
export class DatabaseAPI extends BaseService {
    @GET("/collections")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body["collections"].map((c) => new Collection()
                .setName(c['name'])
                .setEncrypt(c['is_encrypt'])
                .setEncryptMethod(c['encrypt_method'])
            );
        });
    })
    async getCollections(@Header("Authorization") authorization: string): Promise<Response> {
        throw new NotImplementedException();
    }

    @PUT("/collections/{collectionName}")
    async createCollection(@Header("Authorization") authorization: string,
                           @Path('collectionName') collectionName: string,
                           @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @DELETE("/{collectionName}")
    async deleteCollection(@Header("Authorization") authorization: string,
                           @Path('collectionName') collectionName: string): Promise<Response> {
        throw new NotImplementedException();
    }

    @POST("/collection/{collectionName}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return new InsertResult()
                .setAcknowledge(body['acknowledge'])
                .setInsertedIds(body['inserted_ids']);
        });
    })
    async insert(@Header("Authorization") authorization: string,
                 @Path('collectionName') collectionName: string,
                 @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @POST("/collection/{collectionName}?op=count")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body["count"];
        });
    })
    async count(@Header("Authorization") authorization: string,
                @Path('collectionName') collectionName: string,
                @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @PATCH("/collection/{collectionName}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return new UpdateResult()
                .setAcknowledged(body['acknowledged'])
                .setMatchedCount(body['matched_count'])
                .setModifiedCount(body['modified_count'])
                .setUpsertedId(body['upserted_id']);
        });
    })
    async update(@Header("Authorization") authorization: string,
                 @Path('collectionName') collectionName: string,
                 @Query("updateone") updateOne: boolean,
                 @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @DELETE("/collection/{collectionName}")
    async delete(@Header("Authorization") authorization: string,
                 @Path('collectionName') collectionName: string,
                 @Query("deleteone") updateOne: boolean,
                 @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/{collectionName}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return new FindResult()
                .setItems(body['items'])
                .setEncrypt(body['is_encrypt'])
                .setEncryptMethod(body['encrypt_method']);
        });
    })
    async find(@Header("Authorization") authorization: string,
               @Path('collectionName') collectionName: string,
               @Query("filter") filter: string,
               @Query("skip") skip: number,
               @Query("limit") limit: number): Promise<Response> {
        throw new NotImplementedException();
    }

    @POST("/query")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return new QueryResult()
                .setItems(body['items'])
                .setEncrypt(body['is_encrypt'])
                .setEncryptMethod(body['encrypt_method']);
        });
    })
    async query(@Header("Authorization") authorization: string,
                @Path('collectionName') collectionName: string,
                @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }
}
