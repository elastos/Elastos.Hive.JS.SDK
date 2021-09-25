import * as http from 'http';
import { checkNotNull } from '../domain/utils';
import { ServiceContext } from './servicecontext';
import { HttpResponseParser } from './httpresponseparser';
import { DeserializationError, HttpException, NodeRPCException } from '../exceptions';
import { HttpMethod } from './httpmethod';
import { Logger } from '../logger';
import { resolve } from 'path';

export class HttpClient {
    public static LOG = new Logger("HttpClient");

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
    public static WITH_AUTHORIZATION = true;
    public static NO_AUTHORIZATION = false;
    public static DEFAULT_TIMEOUT = 5000;
    public static DEFAULT_PROTOCOL = "http";
    public static DEFAULT_PORT = 80;
    public static DEFAULT_METHOD = "PUT";
    public static DEFAULT_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11";
    public static DEFAULT_HEADERS: http.OutgoingHttpHeaders = {
        "Transfer-Encoding": "chunked",
        "Connection": "Keep-Alive",
        "User-Agent": HttpClient.DEFAULT_AGENT
    };

    public static DEFAULT_OPTIONS: http.RequestOptions = {
        method: HttpClient.DEFAULT_METHOD,
        protocol: HttpClient.DEFAULT_PROTOCOL,
        port: HttpClient.DEFAULT_PORT,
        timeout: HttpClient.DEFAULT_TIMEOUT,
        headers: HttpClient.DEFAULT_HEADERS
    };

    private withAuthorization = false;
    private serviceContext: ServiceContext;
    private httpOptions: http.RequestOptions;

    constructor(serviceContext: ServiceContext, withAuthorization: boolean, httpOptions: http.RequestOptions) {
        this.serviceContext = serviceContext;
        this.withAuthorization = withAuthorization;
        this.httpOptions = this.validateOptions(httpOptions);
    }

    public async send<T>(serviceEndpoint: string, rawPayload: any, responseParser: HttpResponseParser<T> = HttpClient.DEFAULT_RESPONSE_PARSER, method?: HttpMethod): Promise<T> {
        checkNotNull(serviceEndpoint, "No service endpoint specified");

        let payload = this.parsePayload(rawPayload, method);
        let options = await this.buildRequest(serviceEndpoint, method);

        options.method === HttpMethod.GET && options.path.concat("?" + payload);

        HttpClient.LOG.initializeCID();
        HttpClient.LOG.debug("HTTP Request: " + options.method + ": " +  options.path + " withAuthorization: " + this.withAuthorization + (payload && payload != HttpClient.NO_PAYLOAD ? " payload: " + payload : ""));

        return new Promise<T>((resolve, reject) => {
            let request = http.request(
              options,
              function(response: http.IncomingMessage) {
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
                    const rawContent = Buffer.concat(chunks).toString();
                    HttpClient.LOG.debug("HTTP Response: Status: " + response.statusCode + (rawContent ? " response: " + rawContent : ""));
                    this.handleResponse(response, rawContent);

                    let deserialized = responseParser.deserialize(rawContent);
                    HttpClient.LOG.debug("deserialized: " + JSON.stringify(deserialized));
                    resolve(deserialized);
                  } catch(e) {
                    reject(
                      new DeserializationError("Unable to deserialize content from " + serviceEndpoint, e)
                    );
                  }
                });
              }
            );
            
            if (options.method != HttpMethod.GET && payload != HttpClient.NO_PAYLOAD) {
                request.write(payload);
                //request.write(JSON.stringify(payload));
            }

            request.end();
        })
    }

    private async buildRequest(serviceEndpoint: string, method: HttpMethod): Promise<http.RequestOptions> {
        let requestOptions: http.RequestOptions = JSON.parse(JSON.stringify(this.httpOptions));
        if (method) {
          requestOptions.method = method;
        }
        requestOptions.path = serviceEndpoint;

        if (this.withAuthorization) {
          requestOptions.headers['Authorization'] = await this.serviceContext.getAccessToken().getCanonicalizedAccessToken();
        }

        return requestOptions;
    }

    private parsePayload(payload: any, method: HttpMethod): string {
        if (payload && method === HttpMethod.GET) {
          //Create query parameters from map
          let query = "";
          for (let prop of Object.keys(payload)) {
            query && query.concat("&");
            query = query.concat(prop + "=" + payload[prop]);
          }
          return query;
        }
        return !payload || typeof payload === "string" ? payload : JSON.stringify(payload);
    }

    private validateOptions(httpOptions: http.RequestOptions): http.RequestOptions {
        checkNotNull(httpOptions, "No HTTP configuration provided");

        httpOptions.protocol = httpOptions.protocol ?? HttpClient.DEFAULT_PROTOCOL;
        httpOptions.port = httpOptions.port ?? HttpClient.DEFAULT_PORT;
        httpOptions.method = httpOptions.method ?? HttpClient.DEFAULT_METHOD;
        httpOptions.timeout = httpOptions.timeout ?? HttpClient.DEFAULT_TIMEOUT;
        httpOptions.headers = httpOptions.headers ?? HttpClient.DEFAULT_HEADERS;

        // If the providerAddress already contains the protocol, we extract it.
        if (this.serviceContext.getProviderAddress().includes("//")) {
          let urlPart = this.serviceContext.getProviderAddress().split("//");
          httpOptions.protocol = urlPart[0];
          httpOptions.host = urlPart[1];  
        } else {
          httpOptions.host = this.serviceContext.getProviderAddress();
        }

        return httpOptions;
    }

    private handleResponse(response: http.IncomingMessage, content: string): void {
      if (response.statusCode != 200) {
        HttpClient.LOG.debug("response code: " + response.statusCode);
        if (this.withAuthorization && response.statusCode == 401) {
          this.serviceContext.getAccessToken().invalidate();
        }
        if (!content) {
          throw new NodeRPCException(response.statusCode, -1, "Empty body.");
        }
        let httpError = JSON.parse(content);
        let errorCode = httpError['internal_code'];
        let errorMessage = httpError['message'];

        throw new NodeRPCException(response.statusCode, errorCode ? errorCode : -1, errorMessage);
      }
    }
}