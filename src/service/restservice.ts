import { HttpClient } from "../connection/httpclient";
import { ServiceEndpoint } from "../connection/serviceEndpoint";

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
}