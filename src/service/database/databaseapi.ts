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
import {InsertResult} from "./insertresult";
import {UpdateResult} from "./updateresult";
import {NotImplementedException} from "../../exceptions";
import {APIResponse} from "../restservice";
import {FindResult} from "./findresult";
import {Collection} from "./collection";

@BasePath("/api/v2/vault/db")
export class DatabaseAPI extends BaseService {
    @GET("/collections")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj["collections"].map((c) => Object.assign(new Collection(), c));
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
        return APIResponse.handleResponseData(data, (jsonObj) => {
            const result = new InsertResult();
            result.setAcknowledge(jsonObj['acknowledge']);
            result.setInsertedIds(jsonObj['inserted_ids']);
            return result;
        });
    })
    async insert(@Header("Authorization") authorization: string,
                 @Path('collectionName') collectionName: string,
                 @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @POST("/collection/{collectionName}?op=count")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj["count"];
        });
    })
    async count(@Header("Authorization") authorization: string,
                @Path('collectionName') collectionName: string,
                @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @PATCH("/collection/{collectionName}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            const result = new UpdateResult();
            result.setAcknowledged(jsonObj['acknowledged']);
            result.setMatchedCount(jsonObj['matched_count']);
            result.setModifiedCount(jsonObj['modified_count']);
            result.setUpsertedId(jsonObj['upserted_id']);
            return result;
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
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return Object.assign(new FindResult(), jsonObj);
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
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return Object.assign(new FindResult(), jsonObj);
        });
    })
    async query(@Header("Authorization") authorization: string,
                @Path('collectionName') collectionName: string,
                @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }
}
