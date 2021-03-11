import { IAppChallenge } from "./Services/Auth.Service";
import { IDatabaseService } from "./Services/Database.Service";
import { IPaymentService } from "./Services/Payment.Service";
import { IScriptingService } from "./Services/Scripting.Service";
export interface IEntityInstance {
    did: string;
    privateKey: string;
}
export interface IOptions {
    appId: string;
    appInstance: IEntityInstance;
    hiveUrl: string;
    applicationCallback: string;
}
export declare class HiveClient {
    private _isConnected;
    private _databaseService;
    private _paymentService;
    private _scriptingService;
    get isConnected(): boolean;
    get Database(): IDatabaseService;
    get Payment(): IPaymentService;
    get Scripting(): IScriptingService;
    private constructor();
    static createInstance(userToken: string, hiveUrl: string): Promise<HiveClient>;
    static createAnonymousInstance(hiveUrl: string): Promise<HiveClient>;
    static getApplicationChallenge(options: IOptions, appDocument: any): Promise<IAppChallenge>;
    static getAuthenticationToken(options: IOptions, userVerifiablePresentation: any): Promise<string>;
    static getQrCode(options: IOptions): Promise<string>;
    private SignIn;
}
export declare class OptionsBuilder {
    private _appId;
    private _appInstance;
    private _hiveUrl;
    private _applicationCallback;
    setHiveHost(url: string): void;
    setApplicationCallback(url: string): void;
    setAppInstance(appId: string, instance: IEntityInstance): void;
    build(): IOptions;
}
