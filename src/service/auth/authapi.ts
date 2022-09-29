import {BasePath, BaseService, Body, POST, Response, ResponseTransformer} from 'ts-retrofit';
import {APIResponse} from "../restservice";

@BasePath("/api/v2")
export class AuthAPI extends BaseService {
    @POST("/did/signin")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj['challenge'];
        });
    })
    async signIn(@Body body: object): Promise<Response> { return null; }

    @POST("/did/auth")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj['token'];
        });
    })
    async auth(@Body body: object): Promise<Response> { return null; }
}
