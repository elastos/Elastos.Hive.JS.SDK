import { HttpClient } from "../http/httpclient";
import { ServiceContext } from "../http/servicecontext";

export class RestService {
    protected serviceContext: ServiceContext;
    protected httpClient: HttpClient;

    protected constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
        this.serviceContext = serviceContext;
        this.httpClient = httpClient;
    }

    public getServiceContext(): ServiceContext {
        return this.serviceContext;
    }

    public getHttpClient(): HttpClient {
        return this.httpClient;
    }
}