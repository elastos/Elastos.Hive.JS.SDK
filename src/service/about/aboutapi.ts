import {BasePath, BaseService, GET, Header, Response, ResponseTransformer} from 'ts-retrofit';
import {VerifiablePresentation} from "@elastosfoundation/did-js-sdk";
import {NotImplementedException} from "../../exceptions";
import {APIResponse} from "../restservice";
import {NodeVersion} from "./nodeversion";
import {NodeInfo} from "./nodeinfo";

@BasePath("/api/v2")
export class AboutAPI extends BaseService {
    @GET("/node/version")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return new NodeVersion(body['major'], body['minor'], body['patch']);
        });
    })
    async version(): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/node/commit_id")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body['commit_id'];
        });
    })
    async commitId(): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/node/info")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            const latestAccessTime = body["latest_access_time"] == -1 ? null
                : new Date(Number(body["latest_access_time"]) * 1000);

            return new NodeInfo()
                .setServiceDid(body['service_did'])
                .setOwnerDid(body['owner_did'])
                .setOwnershipPresentation(VerifiablePresentation.parse(JSON.stringify(body['ownership_presentation'])))
                .setName(body['name'])
                .setEmail(body['email'])
                .setDescription(body['description'])
                .setVersion(body['version'])
                .setLastCommitId(body['last_commit_id'])
                .setUserCount(body['user_count'])
                .setVaultCount(body['vault_count'])
                .setBackupCount(body['backup_count'])
                .setLatestAccessTime(latestAccessTime)
                .setMemoryUsed(body['memory_used'])
                .setMemoryTotal(body['memory_total'])
                .setStorageUsed(body['storage_used'])
                .setStorageTotal(body['storage_total']);
        });
    })
    async info(@Header("Authorization") auth: string): Promise<Response> {
        throw new NotImplementedException();
    }
}
