import {BasePath, BaseService, Body, GET, Header, POST, Response, ResponseTransformer} from 'ts-retrofit';
import {APIResponse} from "../restservice";
import {BackupResult, BackupResultResult, BackupResultState} from "../..";

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
                throw Error('Unknown state.');
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
                throw Error('Unknown result.');
            }
        }

        return APIResponse.handleResponseData(data, (jsonObj) => {
            jsonObj['state'] = getBackupResultStateByStr(jsonObj['state']);
            jsonObj['result'] = getBackupResultStatusByStr(jsonObj['result']);
            return Object.assign(new BackupResult(), jsonObj);
        });
    })
    async getState(@Header("Authorization") auth: string): Promise<Response> { return null; }

    @POST("/vault/content?to=hive_node")
    async saveToNode(@Header("Authorization") auth: string,
                     @Body body: object): Promise<Response> { return null; }

    @POST("/vault/content?from=hive_node")
    async restoreFromNode(@Header("Authorization") auth: string,
                          @Body body: object): Promise<Response> { return null; }
}
