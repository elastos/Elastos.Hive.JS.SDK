import {ServiceEndpoint} from "./connection/serviceendpoint";
import {AppContext} from "./connection/auth/appcontext";
import {ScriptingService} from "./service/scripting/scriptingservice";
import {InvalidParameterException} from "./exceptions";
import {ProgressHandler} from "./service/files/progresshandler";
import {ProgressDisposer} from "./service/files/progressdisposer";

export class ScriptRunner extends ServiceEndpoint{
    private scriptService: ScriptingService;

    /**
     * ScriptRunner can be used by other caller with authorization token.
     *
     * @param context application context
     * @param providerAddress provider address
     */
    constructor(context: AppContext, providerAddress?: string) {
        super(context, providerAddress);

        if (!context)
            throw new InvalidParameterException('Invalid parameter context');

        this.scriptService = new ScriptingService(this);
    }

    /**
     * Executes a previously registered server side script with a normal way.
     * where the values can be passed as part of the query.
     * Vault owner or external users are allowed to call scripts on someone's vault.
     *
     * @param scriptName the name of the script to unregister.
     * @param params parameters to run the script.
     * @param targetDid target DID.
     * @param targetAppDid target application DID.
     */
    async callScript<T>(scriptName: string, params: any, targetDid: string, targetAppDid: string): Promise<T> {
        return await this.scriptService.callScript(scriptName, params, targetDid, targetAppDid);
    }

    /**
     * Executes a previously registered server side script with a direct URL
     * where the values can be passed as part of the query.
     * Vault owner or external users are allowed to call scripts on someone's vault.
     *
     * @param scriptName the name of the script to unregister.
     * @param params parameters to run the script.
     * @param targetDid target DID.
     * @param targetAppDid target application DID.
     */
    async callScriptUrl<T>(scriptName: string, params: string, targetDid: string, targetAppDid: string): Promise<T> {
        return await this.scriptService.callScriptUrl(scriptName, params, targetDid, targetAppDid);
    }

    /**
     * Upload file by transaction ID
     *
     * @param transactionId Transaction ID which can be got by the calling of the script 'fileUpload'.
     * @param data File content.
     * @param progressHandler The callback to get the progress of uploading with percent value. Only supported on browser side.
     */
    async uploadFile(transactionId: string, data: Buffer | string,
                     progressHandler: ProgressHandler = new ProgressDisposer()): Promise<void> {
        return await this.scriptService.uploadFile(transactionId, data, progressHandler);
    }

    /**
     * Download file by transaction ID
     *
     * @param transactionId Transaction ID which can be got by the calling of the script 'fileDownload'.
     * @param progressHandler Get the progress of downloading with percent value.
     */
    async downloadFile(transactionId: string,
                       progressHandler: ProgressHandler = new ProgressDisposer()): Promise<Buffer> {
        return await this.scriptService.downloadFile(transactionId, progressHandler);
    }

    /**
     * This is the compatible implementation for downloading file by the hive url
     * which comes from v1 version SDK. The hive url definition is as this format:
     * <br>
     * hive://&lt;targetDid&gt;@&lt;targetAppDid&gt;/&lt;scriptName&gt;?params=&lt;paramJsonStr&gt;
     *
     * @param hiveUrl
     */
    async downloadFileByHiveUrl(hiveUrl: string): Promise<Buffer> {
        return await this.scriptService.downloadFileByHiveUrl(hiveUrl);
    }
}
