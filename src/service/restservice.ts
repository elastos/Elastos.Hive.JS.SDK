import {Cipher, DIDDocument} from "@elastosfoundation/did-js-sdk";
import {ServiceBuilder} from "ts-retrofit";
import {HttpClient, HttpResponseParser, NodeRPCException, ServiceEndpoint, UnauthorizedException} from "..";
import { Logger } from '../utils/logger';

/**
 * Wrapper class to get the response body as a result object.
 */
export class APIResponse<T> {
    constructor(private response) {}

    get(responseParser: HttpResponseParser<T> = HttpClient.DEFAULT_RESPONSE_PARSER): T {
        return responseParser.deserialize(this.response.data); // data is an Object.
    }
}

/**
 * TODO: To be removed.
 */
export class RestService {
    protected constructor(protected serviceContext: ServiceEndpoint, protected httpClient: HttpClient) {
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

/**
 * Base class for all services.
 */
export class RestServiceT<T> extends RestService {
    private static LOG = new Logger("RestServiceT");

    private api;

    protected constructor(serviceContext: ServiceEndpoint, httpClient: HttpClient) {
        super(serviceContext, httpClient);
    }

    protected async getAPI<T>(api): Promise<T> {
        if (this.api == null) {
            this.api = new ServiceBuilder()
                .setEndpoint(await this.serviceContext.getProviderAddress())
                .setRequestInterceptors((config) => {
                    // TODO: body
                    RestServiceT.LOG.info(`REQUEST: URL={}, METHOD={}, TOKEN={}`,
                        config['url'],
                        config['method'],
                        'Authorization' in config['headers'] ? config['headers']['Authorization'] : '[NO TOKEN]');
                    return config;
                })
                .setResponseInterceptors((response) => {
                    RestServiceT.LOG.info(`RESPONSE: URL={}, METHOD={}, STATUS={}, BODY={}`,
                        response['config']['url'],
                        response['config']['method'],
                        response.status,
                        JSON.stringify(response.data));
                    return response;
                })
                .build<T>(api);
        }
        return this.api;
    }

    protected async getAccessToken(): Promise<string> {
        const accessToken = this.serviceContext.getAccessToken();
        return 'token ' + await accessToken.fetch();
    }

    protected async tryHandleResponseError(e): Promise<void> {
        if (!(e instanceof Error) || !('response' in e) || !e['response'] || typeof e['response'] != 'object') {
            return;
        }

        if ('config' in e && 'url' in e['config'] && e['config']['url']) {
            RestServiceT.LOG.info('ERROR RESPONSE: URL={}, METHOD={}, STATUS={}, BODY={}',
                e['config']['url'],
                e['config']['method'],
                // @ts-ignore
                JSON.stringify(e.response.status),
                // @ts-ignore
                JSON.stringify(e.response.data));
        }

        // @ts-ignore
        const response = e.response;
        if (response.status >= 300) {
            if (response.status == 401 && this.serviceContext.hasAppContext()) {
                await this.serviceContext.getAccessToken().invalidate();
            }
            let [status, errorCode, errorMessage, jsonObj] = [response.status, -1, '', response.data];
            if (jsonObj && typeof jsonObj == 'object' && 'error' in jsonObj && 'message' in jsonObj['error']) {
                if ('internal_code' in jsonObj['error']) {
                    errorCode = jsonObj['error']['internal_code'];
                }
                errorMessage = jsonObj['error']['message'];
            }
            throw NodeRPCException.forHttpCode(status, errorMessage, errorCode);
        }
    }
}

