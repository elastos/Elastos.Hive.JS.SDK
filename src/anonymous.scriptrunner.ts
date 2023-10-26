import {ServiceEndpoint} from "./connection/serviceendpoint";
import {ScriptingService} from "./service/scripting/scriptingservice";
import {InvalidParameterException} from "./exceptions";
import {ProgressHandler} from "./service/files/progresshandler";
import {ProgressDisposer} from "./service/files/progressdisposer";

/**
 * The script runner is for running script anonymously.
 *
 * This means we can call script API without token.
 * Also means this ServiceEndpoint has no AppContext.
 */
export class AnonymousScriptRunner extends ServiceEndpoint{
    private scriptService: ScriptingService;

    /**
     * AnonymousScriptRunner can be used by other caller without authorization token.
     *
     * @param providerAddress must provide when context is null
     */
    constructor(providerAddress: string) {
        super(null, providerAddress);

        if (!providerAddress)
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
     * @param progressHandler Get the progress of uploading with percent value.
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
     * This is the implementation for downloading file by the hive url anonymously.
     *
     * This requires the script on hive url MUST be set all user and app anonymous to true.
     *
     * The hive url definition is as this format:
     * <br>
     * hive://&lt;targetDid&gt;@&lt;targetAppDid&gt;/&lt;scriptName&gt;?params=&lt;paramJsonStr&gt;
     *
     * @param hiveUrl
     */
    static async downloadFileByHiveUrl(hiveUrl: string): Promise<Buffer> {
        return await ScriptingService.downloadFileByHiveUrlDirect(hiveUrl);
    }

    /**
     * Download anonymous file which can be uploaded by the files service with publicOnIPFS flag = true.
     *
     * @param targetDid
     * @param targetAppDid
     * @param path the path of the file.
     */
    async downloadAnonymousFile(targetDid: string, targetAppDid: string, path: string): Promise<Buffer> {
        const result = await this.scriptService.callScript('__anonymous_files__', {
                'path': path
            }, targetDid, targetAppDid);
        return await this.scriptService.downloadFile(Object.values(result)[0]['transaction_id']);
    }
}
