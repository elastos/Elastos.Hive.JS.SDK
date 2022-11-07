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
import {APIResponse} from "../restservice";
import {FileInfo} from "../..";

@BasePath("/api/v2/vault")
export class FilesAPI extends BaseService {
    @PUT("/files/{path}")
    @RequestTransformer((data: any, headers?: any) => {
        // INFO: Compatible with ts-retrofit style.
        return data['data'];
    })
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj["cid"];
        });
    })
    async upload(
        @Header("Authorization") authorization: string,
        @Query("public") isPublic: boolean,
        @Query("script_name") scriptName: string,
        @Query("is_encrypt") isEncrypt: boolean,
        @Query("encrypt_method") encrypt_method: string,
        @Path("path") path: string,
        @Body body: object
    ): Promise<Response> {
        throw new Error("Not implemented");
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
        throw new Error("Not implemented");
    }

    @GET("/files/{path}?comp=children")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            const rawFiles = jsonObj["value"];
            let files = [];
            for (let file of rawFiles) {
                let item = new FileInfo()
                    .setCreated(file["created"])
                    .setUpdated(file["updated"])
                    .setName(file["name"])
                    .setAsFile(file["is_file"])
                    .setSize(file["size"]);
                files.push(item);
            }
            return files;
        });
    })
    async listChildren(
        @Header("Authorization") authorization: string,
        @Path("path") path: string
    ): Promise<Response> {
        throw new Error("Not implemented");
    }

    @GET("/files/{path}?comp=metadata")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return new FileInfo()
                .setCreated(jsonObj["created"])
                .setUpdated(jsonObj["updated"])
                .setName(jsonObj["name"])
                .setAsFile(jsonObj["is_file"])
                .setSize(jsonObj["size"]);
        });
    })
    async getMetadata(
        @Header("Authorization") authorization: string,
        @Path("path") path: string
    ): Promise<Response> {
        throw new Error("Not implemented");
     }

    @GET("/files/{path}?comp=hash")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj['hash'];
        });
    })
    async getHash(
        @Header("Authorization") authorization: string,
        @Path("path") path: string
    ): Promise<Response> {
        throw new Error("Not implemented");
    }

    @PUT("/files/{path}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj['name'];
        });
    })
    async copy(
        @Header("Authorization") authorization: string,
        @Path("path") src: string,
        @Query("dest") dest: string
    ): Promise<Response> {
        throw new Error("Not implemented");
    }

    @PATCH("/files/{path}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj['name'];
        });
    })
    async move(
        @Header("Authorization") authorization: string,
        @Path("path") src: string,
        @Query("to") dst: string
    ): Promise<Response> {
        throw new Error("Not implemented");
    }

    @DELETE("/files/{path}")
    async delete(
        @Header("Authorization") authorization: string,
        @Path("path") path: string
    ): Promise<Response> {
        throw new Error("Not implemented");
     }
}
