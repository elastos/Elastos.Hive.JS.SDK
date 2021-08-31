import * as http from 'http';
import { checkNotNull } from '../domain/utils';
import { ServiceContext } from './servicecontext';
import { HttpResponseParser } from './httpresponseparser';
import { HttpException } from '../exceptions';
import { HttpMethod } from './httpmethod';

export class HttpClient {
    public static DEFAULT_RESPONSE_PARSER = <HttpResponseParser<any>> {
			deserialize(content: any): string {
				return JSON.stringify(content);
			},
			rawContent(content: any): any {
				return JSON.stringify(content);
			}
		};
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

        return new Promise((resolve, reject) => {
          let options = this.buildRequest(serviceEndpoint, method)
            let request = http.request(
              options,
              function(response) {
                const { statusCode } = response;
                if (statusCode >= 300) {
                  reject(
                    new HttpException(statusCode, response.statusMessage)
                  )
                }
                const chunks = [];
                response.on('data', (chunk) => {
                  chunks.push(chunk);
                });
                response.on('end', () => {
                  const result = Buffer.concat(chunks).toString();
                  resolve(responseParser.deserialize(result));
                });
              }
            );
            
            if (options.method != "GET") {
                request.write(JSON.stringify(payload));
            }

            request.end();
        })
    }

    private buildRequest(serviceEndpoint: string, method: HttpMethod): http.RequestOptions {
        let requestOptions: http.RequestOptions = JSON.parse(JSON.stringify(this.httpOptions));
        if (method) {
          requestOptions.method = method;
        }
        requestOptions.path = serviceEndpoint;
        requestOptions.headers['Authorization'] = this.serviceContext.getAccessToken().getCanonicalizedAccessToken();

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