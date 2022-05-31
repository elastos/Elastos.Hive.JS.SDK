import {ServiceEndpoint} from "./connection/serviceendpoint";
import {HttpClient} from "./connection/httpclient";
import {AppContext} from "./connection/auth/appcontext";
import {ScriptingService} from "./service/scripting/scriptingservice";


export class ScriptRunner extends ServiceEndpoint{

    private scriptService: ScriptingService;

    /**
     * ScriptRunner can be used by other caller with or without auth token.
     *
     * @param context null means to do anonymous access the script
     * @param providerAddress must provide when context is null
     */
    public constructor(context: AppContext, providerAddress?: string) {
        super(context, providerAddress);
        const is_auth = context != null ? HttpClient.WITH_AUTHORIZATION : HttpClient.NO_AUTHORIZATION;
        const httpClient   = new HttpClient(this, is_auth, HttpClient.DEFAULT_OPTIONS);
        this.scriptService = new ScriptingService(this, httpClient);
    }

    public async callScript<T>(name: string, params: any, targetDid: string, targetAppDid: string): Promise<T> {
        return await this.scriptService.callScript(name, params, targetDid, targetAppDid);
    }

    public async callScriptUrl<T>(name: string, params: string, targetDid: string, targetAppDid: string): Promise<T> {
        return await this.scriptService.callScriptUrl(name, params, targetDid, targetAppDid);
    }

    public async uploadFile(transactionId: string, data: Buffer | string): Promise<void> {
        return await this.scriptService.uploadFile(transactionId, data);
    }

    public async downloadFile(transactionId: string): Promise<Buffer> {
        return await this.scriptService.downloadFile(transactionId);
    }

    public async downloadFileByHiveUrl(hiveUrl: string): Promise<Buffer> {
        return await this.scriptService.downloadFileByHiveUrl(hiveUrl);
    }

}
