import {BasePath, BaseService, GET, Header, Response, ResponseTransformer} from 'ts-retrofit';
import {VerifiablePresentation} from "@elastosfoundation/did-js-sdk";
import {NodeVersion} from "./nodeversion";
import {NodeInfo} from "./nodeinfo";
import {APIResponse} from "../restservice";

@BasePath("/api/v2")
export class AboutAPI extends BaseService {
    @GET("/node/version")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return new NodeVersion(jsonObj['major'], jsonObj['minor'], jsonObj['patch']);
        });
    })
    async version(): Promise<Response> { return null; }

    @GET("/node/commit_id")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj['commit_id'];
        });
    })
    async commitId(): Promise<Response> { return null; }

    @GET("/node/info")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            jsonObj['ownership_presentation'] = VerifiablePresentation.parse(JSON.stringify(jsonObj['ownership_presentation']));
            return Object.assign(new NodeInfo(), jsonObj);
        });
    })
    async info(@Header("Authorization") auth: string): Promise<Response> { return null; }
}
