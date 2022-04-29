import {ServiceEndpoint} from "./connection/serviceendpoint";
import {HttpClient} from "./connection/httpclient";
import {AppContext} from "./connection/auth/appcontext";
import {ScriptingService} from "./service/scripting/scriptingservice";


export class ScriptRunner extends ServiceEndpoint{

    private scriptService: ScriptingService;

    public constructor(context: AppContext, providerAddress?: string) {
        super(context, providerAddress);
        const httpClient   = new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
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
