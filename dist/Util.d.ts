export interface IPostOptions {
    url: string;
    userToken?: string;
    body?: any;
}
export declare class Util {
    static SendPost(options: IPostOptions): Promise<any>;
}
