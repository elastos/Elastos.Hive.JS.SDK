import {BasePath, BaseService, Body, POST, Response, ResponseTransformer} from 'ts-retrofit';
import {APIResponse} from "../restservice";
import {NotImplementedException} from "../../exceptions";

@BasePath("/api/v2")
export class AuthAPI extends BaseService {
    @POST("/did/signin")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body['challenge'];
        });
    })
    async signIn(@Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @POST("/did/auth")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body['token'];
        });
    })
    async auth(@Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }
}
