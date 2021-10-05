import { ISessionItems } from "../Interfaces/ISessionItems";
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
    acknowledged?: boolean;
    matched_count?: number;
    modified_count?: number;
    upserted_id?: string;
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
export declare class ScriptingService implements IScriptingService {
    private _isConnected;
    private _session;
    constructor(session: ISessionItems);
    private checkConnection;
    SetScript(script: ISetScriptData): Promise<ISetScriptResponse>;
    RunScript<T>(script: IRunScriptData): Promise<IRunScriptResponse<T>>;
}
