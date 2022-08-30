import { HttpClient } from "../connection/httpclient";
import { ServiceEndpoint } from "../connection/serviceendpoint";
import {Cipher, DIDDocument} from "@elastosfoundation/did-js-sdk";

export class RestService {
    protected serviceContext: ServiceEndpoint;
    protected httpClient: HttpClient;

    protected constructor(serviceContext: ServiceEndpoint, httpClient: HttpClient) {
        this.serviceContext = serviceContext;
        this.httpClient = httpClient;
    }

    public getServiceContext(): ServiceEndpoint {
        return this.serviceContext;
    }

    public getHttpClient(): HttpClient {
        return this.httpClient;
    }

    public async getEncryptionCipher(identifier: string, secureCode: number, storepass: string): Promise<Cipher> {
        const appContext = this.serviceContext.getAppContext();
        const doc: DIDDocument = await appContext.getAppContextProvider().getAppInstanceDocument();
        return await doc.createCipher(identifier, secureCode, storepass);
    }
}