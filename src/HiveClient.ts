
import { ISessionItems } from "./Interfaces/ISessionItems";
import { AuthService, IAppChallenge } from "./Services/Auth.Service"
import { DatabaseService, IDatabaseService } from "./Services/Database.Service";
import { IPaymentService, PaymentService } from "./Services/Payment.Service";
import { IScriptingService, ScriptingService } from "./Services/Scripting.Service";

export interface IEntityInstance{
    did:string;
    privateKey: string
}



export interface IOptions{
    appId: string;
    appInstance: IEntityInstance;
    hiveUrl: string;
    applicationCallback: string;

}


export class HiveClient{
   
   
   private _isConnected: boolean = false;
   private _databaseService!: IDatabaseService;
   private _paymentService!: IPaymentService;
   private _scriptingService!: IScriptingService;

    get isConnected(): boolean {
       return this._isConnected
    }

    get Database(): IDatabaseService{
        return this._databaseService;
    }

    get Payment(): IPaymentService{
        return this._paymentService
    }
    
    get Scripting() : IScriptingService{
        return this._scriptingService;
    }

   
    private constructor() {
        
    }



    public static async createInstance(userToken: string, hiveUrl: string) : Promise<HiveClient>{
        let client = new HiveClient()
        let session: ISessionItems = {
            hiveInstanceUrl: hiveUrl,
            isAnonymous: false,
            userToken: userToken
        }
        await client.SignIn(session)
        return client;
    }

    public static async createAnonymousInstance(hiveUrl: string) : Promise<HiveClient>{
        let client = new HiveClient()
        let session: ISessionItems = {
            hiveInstanceUrl: hiveUrl, 
            isAnonymous: true
        }
        await client.SignIn(session)
        return client;
    }

    public static async getApplicationChallenge(options: IOptions, appDocument: any) : Promise<IAppChallenge>{
        let authService = new AuthService(options)

      

        return authService.getAppChallenge(appDocument)
    }

    public static async getAuthenticationToken(options: IOptions, userVerifiablePresentation: any) : Promise<string>{
        let authService = new AuthService(options)
        return authService.getAuthenticationToken(userVerifiablePresentation)
    }

    public static getQrCode(options: IOptions) : Promise<string>{
        let authService = new AuthService(options);
        return authService.getElastosQrCode()
    }

    private async SignIn(session: ISessionItems) {
        try {
            
            

            this._databaseService = new DatabaseService(session);
            this._paymentService = new PaymentService(session);
            this._scriptingService = new ScriptingService(session);
            

            this._isConnected = true;
        } catch (error) {
            console.error("Error on sign in", error)
            this._isConnected = false;
        }
    }

}

export class OptionsBuilder{
    private _appId:string = ""
    private _appInstance!: IEntityInstance;
    private _hiveUrl: string = "";
    private _applicationCallback: string = "";

    

       

     public setHiveHost(url: string){
       this._hiveUrl = url
     }

     public setApplicationCallback(url: string){
        this._applicationCallback = url
      }

    public setAppInstance(appId: string, instance: IEntityInstance)  {
        this._appId = appId
        this._appInstance = instance
     }

   

     
    

    public build() : IOptions{
       return {
          appId: this._appId,
          appInstance: this._appInstance,
          hiveUrl: this._hiveUrl,
          applicationCallback: this._applicationCallback
       }
    }
}