import { ISessionItems } from "../Interfaces/ISessionItems";
export interface IPaymentService {
    CreateFreeVault(): Promise<void>;
    GetVaultServiceInfo(): Promise<IVaultServiceInfo>;
}
export declare enum EnumVaultPackage {
    Free = "Free",
    Rookie = "Rookie",
    Advanced = "Advanced"
}
export interface IVaultServiceInfo {
    max_storage: number;
    file_use_storage: number;
    db_use_storage: number;
    modify_time: Date;
    start_time: Date;
    end_time: Date;
    pricing_using: EnumVaultPackage;
}
export declare class PaymentService implements IPaymentService {
    private _isConnected;
    private _session;
    constructor(session: ISessionItems);
    private checkConnection;
    CreateFreeVault(): Promise<void>;
    GetVaultServiceInfo(): Promise<IVaultServiceInfo>;
}
