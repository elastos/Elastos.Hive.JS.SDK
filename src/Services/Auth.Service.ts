
import { IOptions } from '../HiveClient';
import { Util } from '../Util'

const rs = require('jsrsasign')


export interface IAppChallenge{
    challenge: string
}

/**
* Authenticate to Hive node api
*/
export class AuthService{
    _options: IOptions;

    /**
     * Options obtained on client instance creation 
     */
    constructor(options: IOptions) {
        this._options = options;        
    }


    public async getAppChallenge(appDidDocument: any): Promise<IAppChallenge>{
        let url = `${this._options.hiveUrl}/api/v1/did/sign_in`
        let payload = {
            "document": JSON.parse(JSON.stringify(appDidDocument, null, ""))
        }
        

        let response = await Util.SendPost({
            url: url, 
            body: payload
        })
        if (!response || response._status !== "OK") throw new Error('Error authenticating did and app'); 



        return {
            challenge: response.challenge
        }
    }
   


    public async getAuthenticationToken(userVerifiablePresentation: any): Promise<string>{
        let ec = new rs.KJUR.crypto.ECDSA({curve: "secp256r1"})
        ec.setPrivateKeyHex(this._options.appInstance.privateKey)

        var tNow = rs.KJUR.jws.IntDate.get('now');
        var tEnd = rs.KJUR.jws.IntDate.get('now + 1month');

        // Header
        var oHeader = {alg: 'ES256', typ: 'JWT', cty: 'json'};
        // Payload
        var oPayload = {
            "iss": this._options.appInstance.did,
            "iat": tNow,
            "exp": tEnd,
            'presentation': JSON.parse(JSON.stringify(userVerifiablePresentation, null, ""))
        };
        
        
        var sHeader = JSON.stringify(oHeader);
        var sPayload = JSON.stringify(oPayload);
        var sJWT = rs.KJUR.jws.JWS.sign("ES256", sHeader, sPayload, ec);

        return await this.AuthenticateUser(sJWT)

    }


    public async getElastosQrCode(): Promise<string>{

        let ec = new rs.KJUR.crypto.ECDSA({curve: "secp256r1"})
        ec.setPrivateKeyHex(this._options.appInstance.privateKey)
        var tNow = rs.KJUR.jws.IntDate.get('now');
        var tEnd = rs.KJUR.jws.IntDate.get('now + 1month');

        // Header
        var oHeader = {alg: 'ES256', typ: 'JWT', cty: 'json'};
        // Payload
        var oPayload = {
            "iss": this._options.appInstance.did,
            "iat": tNow,
            "exp": tEnd,
            "appid": this._options.appId,
            "appdid": this._options.appInstance.did,
            "appinstancedid": this._options.appInstance.did,
            "callbackurl": this._options.applicationCallback
        };
        
        
        var sHeader = JSON.stringify(oHeader);
        var sPayload = JSON.stringify(oPayload);
        var sJWT = rs.KJUR.jws.JWS.sign("ES256", sHeader, sPayload, ec);
        return `https://did.elastos.net/appidcredissue/${sJWT}`
    }
    

    private async AuthenticateUser(authToken: string) : Promise<string>{
        let url = `${this._options.hiveUrl}/api/v1/did/auth`
        let document = {
            "jwt": authToken
        }
        let response = await Util.SendPost({
            url: url, 
            body: document
        })
        return response.access_token
    }

    
}