import { ISessionItems } from "../Interfaces/ISessionItems";
import { Util } from "../Util";

export interface IPaymentService{
    CreateFreeVault(): Promise<void>;
    GetVaultServiceInfo() : Promise<IVaultServiceInfo>;
}

export enum EnumVaultPackage{
    Free = "Free",
    Rookie = "Rookie",
    Advanced = "Advanced"
}

export interface IVaultServiceInfo{
    max_storage: number,
    file_use_storage: number,
    db_use_storage: number,
    modify_time: Date,
    start_time: Date,
    end_time: Date,
    pricing_using: EnumVaultPackage
}


export class PaymentService implements IPaymentService {
    private _isConnected: boolean = false;
    private _session: ISessionItems;

    constructor(session: ISessionItems) {
        if (session && !session.isAnonymous && session.userToken && session.userToken.length > 0) {
            this._isConnected = true;
        }
        this._session = session;
    }

    private checkConnection() {
        if (!this._isConnected) {
            throw Error("Hive is not connected")
        }
    }

    async CreateFreeVault()  {
        this.checkConnection()

        await Util.SendPost({
            url: `${this._session.hiveInstanceUrl}/api/v1/service/vault/create`,
            userToken: this._session.userToken
        })
    }

    async GetVaultServiceInfo() : Promise<IVaultServiceInfo>  {
        this.checkConnection()

       let response =  await Util.SendPost({
            url: `${this._session.hiveInstanceUrl}/api/v1/service/vault`,
            userToken: this._session.userToken
        })


        return {
            max_storage: response.vault_service_info.max_storage,
            file_use_storage: response.vault_service_info.file_use_storage,
            db_use_storage: response.vault_service_info.db_use_storage,
            modify_time: new Date(response.vault_service_info.modify_time * 1000),
            start_time: new Date(response.vault_service_info.start_time * 1000),
            end_time: new Date(response.vault_service_info.end_time * 1000),
            pricing_using: response.vault_service_info.pricing_using
        }
    }
}