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
    service_did: string;
    storage_quota: number;
    storage_used: number;
    created: Date;
    updated: Date;
    pricing_plan: string;
}
export declare class PaymentService implements IPaymentService {
    private _isConnected;
    private _session;
    constructor(session: ISessionItems);
    private checkConnection;
    CreateFreeVault(): Promise<void>;
    GetVaultServiceInfo(): Promise<IVaultServiceInfo>;
}
