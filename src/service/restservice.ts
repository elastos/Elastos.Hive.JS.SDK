import {Cipher, DIDDocument} from "@elastosfoundation/did-js-sdk";
import {BaseService, ServiceBuilder} from "ts-retrofit";
import {AppContext, NetworkException, ServiceEndpoint} from "..";
import {Logger} from '../utils/logger';
import {assertTrue} from "../../tests/src/util";
import {NodeExceptionAdapter} from "../exceptions";

/**
 * Wrapper class to get the response body as a result object.
 */
export class APIResponse {
    /**
     * Transform the data on @ResponseTransformer to json object.
     * Do not use @ResponseTransformer if just want to get error dict
     *      which will be converted to dict by axios internal.
     *
     * @param data response.data (raw string)
     * @param callback Whether the data is JSON format string. Or raw data, such as file content.
     */
    static handleResponseData(data: any, callback?: (jsonObj) => any) {
        if (!data) {
            return data;
        }

        let jsonObj = null;
        try {
            // try to convert error.
            jsonObj = JSON.parse(data);
            if ('error' in jsonObj && jsonObj['error'] && 'message' in jsonObj['error']) {
                // error response data.
                return jsonObj;
            }
        } catch (e) {
            // no error, skip.
        }

        // success response

        if (!callback) {
            return Buffer.from(data, 'binary');
        }

        if (!jsonObj) {
            return data;
        }

        return callback(jsonObj);
    }
}

/**
 * Base class for all services.
 */
export class RestServiceT<T> {
    private static _LOG = new Logger("RestServiceT");

    private api;

    constructor(private serviceContext: ServiceEndpoint) {}

    getServiceContext(): ServiceEndpoint {
        return this.serviceContext;
    }

    async getEncryptionCipher(identifier: string, secureCode: number, storepass: string): Promise<Cipher> {
        const appContext = this.serviceContext.getAppContext();
        const doc: DIDDocument = appContext.getAppContextProvider().getAppInstanceDocument();
        return await doc.createCipher(identifier, secureCode, storepass);
    }

    private async getAPI<T extends BaseService>(api: new (builder: ServiceBuilder) => T, extraConfig?: object): Promise<T> {
        if (this.api == null) {
            this.api = new ServiceBuilder() // TODO: use same ServiceBuilder
                .setEndpoint(await this.serviceContext.getProviderAddress())
                .setRequestInterceptors((config) => {
                    RestServiceT._LOG.info(`REQUEST: URL={}, METHOD={}, TOKEN={}, {}`,
                        config['url'],
                        config['method'],
                        'Authorization' in config['headers'] ? config['headers']['Authorization'] : 'null',
                        // BUGBUG: consider the bug of replace with {} on logger.
                        `ARGS=${JSON.stringify(config['params'])}, BODY=${JSON.stringify(config['data'])}`);

                    config['withCredentials'] = false; // CORS
                    config['timeout'] = this.serviceContext.getAppContext().getNetworkTimeout();

                    // uploading or other request body size
                    config['maxContentLength'] = Infinity;
                    config['maxBodyLength'] = Infinity;

                    return extraConfig ? {...config, ...extraConfig} : config;
                })
                .setResponseInterceptors((response) => {
                    RestServiceT._LOG.info(`RESPONSE: URL={}, METHOD={}, STATUS={}, BODY={}`,
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

    async callAPI<T extends BaseService>(api: new (builder: ServiceBuilder) => T,
                                        callback: (a: T) => Promise<any>, // MUST return Response
                                        extraConfig?): Promise<any> {
        const serviceApi = await this.getAPI(api, extraConfig);
        try {
            // do real api call
            const response = await callback(serviceApi);
            assertTrue(response);
            return response.data;
        } catch (e) {
            await this.handleResponseError(e);
        }
    }

    async getAccessToken(): Promise<string> {
        if (!this.serviceContext.hasAppContext()) {
            return ''; // anonymous access on scripting module.
        }

        const accessToken = this.serviceContext.getAccessToken();
        return 'token ' + await accessToken.fetch();
    }

    private async tryHandleResponseError(e: Error): Promise<void> {
        if (!('response' in e) || !e['response'] || typeof e['response'] != 'object') {
            return;
        }

        if ('config' in e && 'url' in e['config'] && e['config']['url']) {
            RestServiceT._LOG.info('ERROR RESPONSE: URL={}, METHOD={}, STATUS={}, BODY={}',
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
            throw NodeExceptionAdapter.forHttpCode(status, errorMessage, errorCode);
        }
    }

    /**
     * Handle response error if need get a specify error.
     *
     * @param e from catch clause.
     * @protected
     */
    private async handleResponseError(e): Promise<void> {
        if (e instanceof Error) {
            await this.tryHandleResponseError(e);
        }
        throw new NetworkException(e.message, e);
    }
}

