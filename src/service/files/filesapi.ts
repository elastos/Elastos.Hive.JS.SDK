import {
    BasePath,
    BaseService,
    Body,
    DELETE,
    GET,
    Header,
    PATCH,
    Path,
    PUT,
    Query,
    Response,
    ResponseTransformer, ResponseType, RequestTransformer
} from 'ts-retrofit';
import {NotImplementedException} from "../../exceptions";
import {APIResponse} from "../restservice";
import {FileInfo} from "./fileinfo";
import {HashInfo} from "./hashinfo";

@BasePath("/api/v2/vault")
export class FilesAPI extends BaseService {
    @PUT("/files/{path}")
    @RequestTransformer((data: any, headers?: any) => {
        // INFO: Compatible with ts-retrofit style.
        return data['data'];
    })
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body["cid"];
        });
    })
    async upload(
        @Header("Authorization") authorization: string,
        @Query("public") isPublic: boolean,
        @Query("is_encrypt") isEncrypt: boolean,
        @Query("encrypt_method") encrypt_method: string,
        @Path("path") path: string,
        @Body body: object
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/files/{path}")
    @ResponseType("arraybuffer")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data);
    })
    async download(
        @Header("Authorization") authorization: string,
        @Path("path") path: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/files/{path}?comp=children")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body["value"].map((file) => new FileInfo()
                .setCreated(file["created"])
                .setUpdated(file["updated"])
                .setName(file["name"])
                .setAsFile(file["is_file"])
                .setSize(file["size"]))
        });
    })
    async listChildren(
        @Header("Authorization") authorization: string,
        @Path("path") path: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/files/{path}?comp=metadata")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return new FileInfo()
                .setCreated(body["created"])
                .setUpdated(body["updated"])
                .setName(body["name"])
                .setAsFile(body["is_file"])
                .setSize(body["size"]);
        });
    })
    async getMetadata(
        @Header("Authorization") authorization: string,
        @Path("path") path: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/files/{path}?comp=hash")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return new HashInfo()
                .setName(body['name'])
                .setAlgorithm(body['algorithm'])
                .setHash(body['hash']);
        });
    })
    async getHash(
        @Header("Authorization") authorization: string,
        @Path("path") path: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @PUT("/files/{path}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body['name'];
        });
    })
    async copy(
        @Header("Authorization") authorization: string,
        @Path("path") src: string,
        @Query("dest") dest: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @PATCH("/files/{path}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body['name'];
        });
    })
    async move(
        @Header("Authorization") authorization: string,
        @Path("path") src: string,
        @Query("to") dst: string
    ): Promise<Response> {
        throw new NotImplementedException();
    }

    @DELETE("/files/{path}")
    async delete(
        @Header("Authorization") authorization: string,
        @Path("path") path: string
    ): Promise<Response> {
        throw new NotImplementedException();
     }
}
