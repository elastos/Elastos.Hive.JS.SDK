import {BasePath, BaseService, Body, DELETE, GET, Header, PATCH, Path, POST, PUT, Query, Response} from 'ts-retrofit';

@BasePath("/api/v2/vault")
export class FilesAPI extends BaseService {
    @GET("/files/{path}")
    async download(@Header("Authorization") authorization: string,
                   @Path("path") path: string): Promise<Response> { return null; }

    @PUT("/files/{path}")
    async upload(@Header("Authorization") authorization: string,
                 @Query("public") isPublic: boolean,
                 @Query("script_name") scriptName: string,
                 @Query("is_encrypt") isEncrypt: boolean,
                 @Query("encrypt_method") encrypt_method: string,
                 @Path("path") path: string,
                 @Body body: Buffer): Promise<Response> { return null; }

    @GET("/files/{path}?comp=children")
    async listChildren(@Header("Authorization") authorization: string,
                       @Path("path") path: string): Promise<Response> { return null; }

    @GET("/files/{path}?comp=metadata")
    async getMetadata(@Header("Authorization") authorization: string,
                      @Path("path") path: string): Promise<Response> { return null; }

    @GET("/files/{path}?comp=hash")
    async getHash(@Header("Authorization") authorization: string,
                  @Path("path") path: string): Promise<Response> { return null; }

    @PUT("/files/{path}")
    async copy(@Header("Authorization") authorization: string,
               @Path("path") src: string,
               @Query("dest") dest: string): Promise<Response> { return null; }

    @PATCH("/files/{path}")
    async move(@Header("Authorization") authorization: string,
               @Path("path") src: string,
               @Query("to") to: string): Promise<Response> { return null; }

    @DELETE("/files/{path}")
    async delete(@Header("Authorization") authorization: string,
                 @Path("path") path: string): Promise<Response> { return null; }
}
