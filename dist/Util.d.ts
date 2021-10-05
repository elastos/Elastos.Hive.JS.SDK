export interface IPostOptions {
    url: string;
    userToken?: string;
    body?: any;
}
export declare class Util {
    static SendGet(options: IPostOptions): Promise<any>;
    static SendPost(options: IPostOptions): Promise<any>;
    static SendPut(options: IPostOptions): Promise<any>;
    static SendPatch(options: IPostOptions): Promise<any>;
    static SendDelete(options: IPostOptions): Promise<any>;
}
