import { ISessionItems } from "../Interfaces/ISessionItems";
import { Util } from "../Util";

export interface IScriptingService {
  SetScript(script: ISetScriptData): Promise<ISetScriptResponse>;
  RunScript<T>(script: IRunScriptData): Promise<IRunScriptResponse<T>>;
}

export interface ISetScriptData {
  name: string;
  allowAnonymousUser?: boolean;
  allowAnonymousApp?: boolean;
  executable: ISetScriptExecutable;
  condition?: ISetScriptCondition;
}

export interface ISetScriptExecutable {
  type: string;
  name: string;
  output?: boolean;
  body: ISetScriptBody | Array<ISetScriptBody>;
}

export interface ISetScriptCondition {
  type: string;
  name: string;
  body: ISetScriptBody | Array<ISetScriptBody>;
}

export interface ISetScriptBody {
  path?: string;
  collection?: string;
  body?: ISetScriptBody | Array<ISetScriptBody>;
  document?: any;
  filter?: any;
  update?: any;
  projection?: any;
  limit?: number;
  options?: any;
  output?: boolean;
}

export interface ISetScriptResponse {
  isSuccess: boolean;
  error?: any;
  response?: any;
}

export interface IRunScriptData {
  name: string;
  context?: any;
  params?: any;
}

export interface IRunScriptResponse<T> {
  isSuccess: boolean;
  error?: any;
  response?: T;
}

export class ScriptingService implements IScriptingService {
  private _isConnected: boolean = false;
  private _session: ISessionItems;

  constructor(session: ISessionItems) {
    if (session) {
      this._isConnected = true;
    }
    this._session = session;
  }

  private checkConnection() {
    if (!this._isConnected) {
      throw Error("Hive is not connected");
    }
  }

  async SetScript(script: ISetScriptData): Promise<ISetScriptResponse> {
    this.checkConnection();

    try {
      if (this._session.isAnonymous) {
        throw Error("Anonymous users are not authorized to set scripts");
      }

      let postData = {
        url: `${this._session.hiveInstanceUrl}/api/v2/vault/scripting/${script.name}`,
        userToken: this._session.userToken,
        body: script,
      };

      let response = await Util.SendPut(postData);
      return {
        isSuccess: true,
        response,
      };
    } catch (error) {
      return {
        isSuccess: false,
        error: error,
      };
    }
  }

  async RunScript<T>(script: IRunScriptData): Promise<IRunScriptResponse<T>> {
    this.checkConnection();

    try {
      let postData = {
        url: `${this._session.hiveInstanceUrl}/api/v2/vault/scripting/${script.name}`,
        body: script,
      };

      if (!this._session.isAnonymous) {
        postData["userToken"] = this._session.userToken;
      }
      let response = await Util.SendPatch(postData);

      return {
        isSuccess: true,
        response: response as T,
      };
    } catch (error) {
      return {
        isSuccess: false,
        error: error,
      };
    }
  }
}
