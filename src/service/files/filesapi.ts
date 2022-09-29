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
    async upload(@Header("Authorization") authorization: string,
                 @Query("public") isPublic: boolean,
                 @Query("script_name") scriptName: string,
                 @Query("is_encrypt") isEncrypt: boolean,
                 @Query("encrypt_method") encrypt_method: string,
                 @Path("path") path: string,
                 @Body body: object): Promise<Response> { return null; }

    @GET("/files/{path}")
    @ResponseType("arraybuffer")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data);
    })
    async download(@Header("Authorization") authorization: string,
                   @Path("path") path: string): Promise<Response> { return null; }

    @GET("/files/{path}?comp=children")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            const rawFiles = jsonObj["value"];
            let files = [];
            for (let file of rawFiles) {
                let fileInfo = new FileInfo();
                fileInfo.setCreated(file["created"]);
                fileInfo.setUpdated(file["updated"]);
                fileInfo.setName(file["name"]);
                fileInfo.setAsFile(file["is_file"]);
                fileInfo.setSize(file["size"]);
                files.push(fileInfo);
            }
            return files;
        });
    })
    async listChildren(@Header("Authorization") authorization: string,
                       @Path("path") path: string): Promise<Response> { return null; }

    @GET("/files/{path}?comp=metadata")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            const newFileInfo = new FileInfo();
            newFileInfo.setCreated(jsonObj["created"]);
            newFileInfo.setUpdated(jsonObj["updated"]);
            newFileInfo.setName(jsonObj["name"]);
            newFileInfo.setAsFile(jsonObj["is_file"]);
            return newFileInfo;
        });
    })
    async getMetadata(@Header("Authorization") authorization: string,
                      @Path("path") path: string): Promise<Response> { return null; }

    @GET("/files/{path}?comp=hash")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj['hash'];
        });
    })
    async getHash(@Header("Authorization") authorization: string,
                  @Path("path") path: string): Promise<Response> { return null; }

    @PUT("/files/{path}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj['name'];
        });
    })
    async copy(@Header("Authorization") authorization: string,
               @Path("path") src: string,
               @Query("dest") dest: string): Promise<Response> { return null; }

    @PATCH("/files/{path}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj['name'];
        });
    })
    async move(@Header("Authorization") authorization: string,
               @Path("path") src: string,
               @Query("to") dst: string): Promise<Response> { return null; }

    @DELETE("/files/{path}")
    async delete(@Header("Authorization") authorization: string,
                 @Path("path") path: string): Promise<Response> { return null; }
}
