import { IOptions } from '../HiveClient';
export interface IAppChallenge {
    challenge: string;
}
export declare class AuthService {
    _options: IOptions;
    constructor(options: IOptions);
    getAppChallenge(appDidDocument: any): Promise<IAppChallenge>;
    getAuthenticationToken(userVerifiablePresentation: any): Promise<string>;
    getElastosQrCode(): Promise<string>;
    private AuthenticateUser;
}
