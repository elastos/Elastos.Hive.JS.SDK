import {ServiceEndpoint} from "./connection/serviceendpoint";
import {AppContext} from "./connection/auth/appcontext";
import {ScriptingService} from "./service/scripting/scriptingservice";
import {InvalidParameterException} from "./exceptions";

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

    async downloadFileByHiveUrl(hiveUrl: string): Promise<Buffer> {
        return await this.scriptService.downloadFileByHiveUrl(hiveUrl);
    }
}
