import {BasePath, BaseService, Body, DELETE, GET, Header, PATCH, Path, PUT,
    RequestTransformer, Response, ResponseTransformer, ResponseType} from 'ts-retrofit';
import {NotImplementedException} from "../../exceptions";
import {APIResponse} from "../restservice";

@BasePath("/api/v2")
export class ScriptingAPI extends BaseService {
    @PUT("/vault/scripting/{scriptName}")
    async registerScript(@Header("Authorization") authorization: string,
                         @Path("scriptName") scriptName: string,
                         @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @PATCH("/vault/scripting/{scriptName}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body;
        });
    })
    async runScript(@Header("Authorization") authorization: string,
                    @Path("scriptName") scriptName: string,
                    @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/vault/scripting/{scriptName}/{targetDid}@{targetAppDid}/{params}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body;
        });
    })
    async runScriptUrl(@Header("Authorization") authorization: string,
                       @Path("scriptName") scriptName: string,
                       @Path("targetDid") targetDid: string,
                       @Path("targetAppDid") targetAppDid: string,
                       @Path("params") params: string): Promise<Response> {
        throw new NotImplementedException();
    }

    @DELETE("/vault/scripting/{scriptName}")
    async unregisterScript(@Header("Authorization") authorization: string,
                           @Path("scriptName") scriptName: string): Promise<Response> {
        throw new NotImplementedException();
    }

    @PUT("/vault/scripting/stream/{transactionId}")
    @RequestTransformer((data: any, headers?: any) => {
        // INFO: Compatible with ts-retrofit style.
        return data['data'];
    })
    async uploadFile(@Header("Authorization") authorization: string,
                     @Path("transactionId") transactionId: string,
                     @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/vault/scripting/stream/{transactionId}")
    @ResponseType("arraybuffer")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data);
    })
    async downloadFile(@Header("Authorization") authorization: string,
                       @Path("transactionId") transactionId: string): Promise<Response> {
        throw new NotImplementedException();
    }
}
