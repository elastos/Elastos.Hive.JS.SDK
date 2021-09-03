import * as http from 'http';
import { checkNotNull } from '../domain/utils';
import { ServiceContext } from './servicecontext';
import { HttpResponseParser } from './httpresponseparser';
import { DeserializationError, HttpException } from '../exceptions';
import { HttpMethod } from './httpmethod';
import { Logger } from '../logger';

export class HttpClient {
    private static LOG = new Logger("HttpClient");

    public static DEFAULT_RESPONSE_PARSER = <HttpResponseParser<any>> {
			deserialize(content: any): string {
				return JSON.stringify(content);
			}
		};
    public static NO_RESPONSE = <HttpResponseParser<void>> {
			deserialize(content: any): void {
				return;
			}
		};
    public static NO_PAYLOAD = {};
    public static DEFAULT_OPTIONS: http.RequestOptions = {};
    
    private static DEFAULT_TIMEOUT = 5000;
    private static DEFAULT_PROTOCOL = "http";
    private static DEFAULT_PORT = 80;
    private static DEFAULT_METHOD = "PUT";
    private static DEFAULT_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11";

    private serviceContext: ServiceContext;
    private httpOptions: http.RequestOptions;

    constructor(serviceContext: ServiceContext, httpOptions: http.RequestOptions) {
        this.serviceContext = serviceContext;
        this.httpOptions = this.validateOptions(httpOptions);
    }

    public async send<T>(serviceEndpoint: string, payload: any, responseParser: HttpResponseParser<T> = HttpClient.DEFAULT_RESPONSE_PARSER, method?: HttpMethod): Promise<T> {
        checkNotNull(serviceEndpoint, "No service endpoint specified");

        let options = await this.buildRequest(serviceEndpoint, method);

        HttpClient.LOG.initializeCID();
        HttpClient.LOG.debug("HTTP Request: " + options.method + ": " +  options.path + (payload && payload != HttpClient.NO_PAYLOAD ? " payload: " + payload : ""));

        return new Promise<T>((resolve, reject) => {
            let request = http.request(
              options,
              function(response) {
                const { statusCode } = response;
                if (statusCode >= 300) {
                  reject(
                    new HttpException(statusCode, response.statusMessage)
                  );
                }
                const chunks = [];
                response.on('data', (chunk) => {
                  chunks.push(chunk);
                });
                response.on('end', () => {
                  try {
                    const result = Buffer.concat(chunks).toString();
                    HttpClient.LOG.debug("HTTP Response: " + (result ? " response: " + result : ""));
                    let response = responseParser.deserialize(result);

                    resolve(response);
                  } catch(e) {
                    reject(
                      new DeserializationError("Unable to deserialize content from " + serviceEndpoint, e)
                    );
                  }
                });
              }
            );
            
            if (payload != HttpClient.NO_PAYLOAD) {
                request.write(JSON.stringify(payload));
            }

            request.end();
        })
    }

    private async buildRequest(serviceEndpoint: string, method: HttpMethod): Promise<http.RequestOptions> {
        let requestOptions: http.RequestOptions = JSON.parse(JSON.stringify(this.httpOptions));
        if (method) {
          requestOptions.method = method;
        }
        requestOptions.path = this.serviceContext.getProviderAddress() + serviceEndpoint;
        requestOptions.headers['Authorization'] = await this.serviceContext.getAccessToken().getCanonicalizedAccessToken();

        return requestOptions;
    }

    private validateOptions(httpOptions: http.RequestOptions): http.RequestOptions {
        checkNotNull(httpOptions, "No HTTP configuration provided");

        httpOptions.protocol = httpOptions.protocol ?? HttpClient.DEFAULT_PROTOCOL;
        httpOptions.port = httpOptions.port ?? HttpClient.DEFAULT_PORT;
        httpOptions.method = httpOptions.method ?? HttpClient.DEFAULT_METHOD;
        httpOptions.timeout = httpOptions.timeout ?? HttpClient.DEFAULT_TIMEOUT;
        httpOptions.host = this.serviceContext.getProviderAddress();
        httpOptions.headers = httpOptions.headers ?? {
            "Transfer-Encoding": "chunked",
            "Connection": "Keep-Alive",
            "User-Agent": HttpClient.DEFAULT_AGENT
        };

        return httpOptions;
    }
}