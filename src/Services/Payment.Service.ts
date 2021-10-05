import { ISessionItems } from "../Interfaces/ISessionItems";
import { Util } from "../Util";

export interface IPaymentService {
  CreateFreeVault(): Promise<void>;
  GetVaultServiceInfo(): Promise<IVaultServiceInfo>;
}

export enum EnumVaultPackage {
  Free = "Free",
  Rookie = "Rookie",
  Advanced = "Advanced",
}

export interface IVaultServiceInfo {
  service_did: string;
  storage_quota: number;
  storage_used: number;
  created: Date;
  updated: Date;
  pricing_plan: string;
}

export class PaymentService implements IPaymentService {
  private _isConnected: boolean = false;
  private _session: ISessionItems;

  constructor(session: ISessionItems) {
    if (
      session &&
      !session.isAnonymous &&
      session.userToken &&
      session.userToken.length > 0
    ) {
      this._isConnected = true;
    }
    this._session = session;
  }

  private checkConnection() {
    if (!this._isConnected) {
      throw Error("Hive is not connected");
    }
  }

  async CreateFreeVault() {
    this.checkConnection();

    await Util.SendPut({
      url: `${this._session.hiveInstanceUrl}/api/v2/subscription/vault`,
      userToken: this._session.userToken,
    });
  }

  async GetVaultServiceInfo(): Promise<IVaultServiceInfo> {
    this.checkConnection();

    let response = await Util.SendGet({
      url: `${this._session.hiveInstanceUrl}/api/v2/subscription/vault`,
      userToken: this._session.userToken,
    });

    return {
      service_did: response.service_did,
      storage_quota: response.storage_quota,
      storage_used: response.storage_used,
      created: new Date(response.created * 1000),
      updated: new Date(response.updated * 1000),
      pricing_plan: response.pricing_plan,
    };
  }
}
