import {BasePath, BaseService, Body, GET, Header, POST, Response, ResponseTransformer} from 'ts-retrofit';
import {NotImplementedException, ServerUnknownException} from "../../exceptions";
import {APIResponse} from "../restservice";
import {BackupResult, BackupResultResult, BackupResultState} from "./backupresult";

@BasePath("/api/v2")
export class BackupAPI extends BaseService {
    @GET("/vault/content")
    @ResponseTransformer((data: any, headers?: any) => {
        function getBackupResultStateByStr(value: string): BackupResultState {
            if (value === 'stop') {
                return BackupResultState.STATE_STOP;
            } else if (value === 'backup') {
                return BackupResultState.STATE_BACKUP;
            } else if (value === 'restore') {
                return BackupResultState.STATE_RESTORE;
            } else {
                throw new ServerUnknownException('Unknown state.');
            }
        }

        function getBackupResultStatusByStr(value: string): BackupResultResult {
            if (value === 'success') {
                return BackupResultResult.RESULT_SUCCESS;
            } else if (value === 'failed') {
                return BackupResultResult.RESULT_FAILED;
            } else if (value === 'process') {
                return BackupResultResult.RESULT_PROCESS;
            } else {
                throw new ServerUnknownException('Unknown result.');
            }
        }

        return APIResponse.handleResponseData(data, (body) => {
            return new BackupResult()
                .setState(getBackupResultStateByStr(body['state']))
                .setResult(getBackupResultStatusByStr(body['result']))
                .setMessage(body['message']);
        });
    })
    async getState(@Header("Authorization") auth: string): Promise<Response> {
        throw new NotImplementedException();
    }

    @POST("/vault/content?to=hive_node")
    async saveToNode(@Header("Authorization") auth: string,
                     @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @POST("/vault/content?from=hive_node")
    async restoreFromNode(@Header("Authorization") auth: string,
                          @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }
}
