import {
    BasePath,
    BaseService,
    Body,
    DELETE,
    GET,
    Header,
    PATCH,
    Path,
    PUT, RequestTransformer,
    Response,
    ResponseTransformer, ResponseType
} from 'ts-retrofit';
import {APIResponse} from "../restservice";

@BasePath("/api/v2")
export class ScriptingAPI extends BaseService {
    @PUT("/vault/scripting/{scriptName}")
    async registerScript(@Header("Authorization") authorization: string,
                         @Path("scriptName") scriptName: string,
                         @Body body: object): Promise<Response> { return null; }

    @PATCH("/vault/scripting/{scriptName}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj;
        });
    })
    async runScript(@Header("Authorization") authorization: string,
                    @Path("scriptName") scriptName: string,
                    @Body body: object): Promise<Response> { return null; }

    @GET("/vault/scripting/{scriptName}/{targetDid}@{targetAppDid}/{params}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj;
        });
    })
    async runScriptUrl(@Header("Authorization") authorization: string,
                       @Path("scriptName") scriptName: string,
                       @Path("targetDid") targetDid: string,
                       @Path("targetAppDid") targetAppDid: string,
                       @Path("params") params: string): Promise<Response> { return null; }

    @DELETE("/vault/scripting/{scriptName}")
    async unregisterScript(@Header("Authorization") authorization: string,
                           @Path("scriptName") scriptName: string): Promise<Response> { return null; }

    @PUT("/vault/scripting/stream/{transactionId}")
    @RequestTransformer((data: any, headers?: any) => {
        // INFO: Compatible with ts-retrofit style.
        return data['data'];
    })
    async uploadFile(@Header("Authorization") authorization: string,
                     @Path("transactionId") transactionId: string,
                     @Body body: object): Promise<Response> { return null; }

    @GET("/vault/scripting/stream/{transactionId}")
    @ResponseType("arraybuffer")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data);
    })
    async downloadFile(@Header("Authorization") authorization: string,
                       @Path("transactionId") transactionId: string): Promise<Response> { return null; }
}
