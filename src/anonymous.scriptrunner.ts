import {ServiceEndpoint} from "./connection/serviceendpoint";
import {ScriptingService} from "./service/scripting/scriptingservice";
import {InvalidParameterException} from "./exceptions";

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

    async callScript<T>(name: string, params: any, targetDid: string, targetAppDid: string): Promise<T> {
        return await this.scriptService.callScript(name, params, targetDid, targetAppDid);
    }

    async callScriptUrl<T>(name: string, params: string, targetDid: string, targetAppDid: string): Promise<T> {
        return await this.scriptService.callScriptUrl(name, params, targetDid, targetAppDid);
    }

    async uploadFile(transactionId: string, data: Buffer | string): Promise<void> {
        return await this.scriptService.uploadFile(transactionId, data);
    }

    async downloadFile(transactionId: string): Promise<Buffer> {
        return await this.scriptService.downloadFile(transactionId);
    }

    /**
     * Download anonymous file which can be uploaded by the files service with public flag.
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
