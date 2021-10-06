import * as http from 'http';
import { checkNotNull } from '../domain/utils';
import { ServiceContext } from './servicecontext';
import { HttpResponseParser } from './httpresponseparser';
import { DeserializationError, HttpException, NodeRPCException, UnauthorizedException } from '../exceptions';
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
    public static WITH_AUTHORIZATION = true;
    public static NO_AUTHORIZATION = false;
    public static DEFAULT_TIMEOUT = 5000;
    public static DEFAULT_PROTOCOL = "http";
    public static DEFAULT_PORT = 9001;
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

    private handleResponse(response: http.IncomingMessage, content: string): void {
      if (response.statusCode >= 300) {
        HttpClient.LOG.debug("response code: {}", response.statusCode);
        if (this.withAuthorization && response.statusCode == 401) {
          this.serviceContext.getAccessToken().invalidate();
        }
        if (!content) {
          throw new NodeRPCException(response.statusCode, -1, "Empty body.");
        }
        let jsonObj = JSON.parse(content);
        if (!jsonObj["error"]) {
          throw new NodeRPCException(response.statusCode, -1, content);
        }
        let httpError = jsonObj["error"];
        let errorCode = httpError['internal_code'];
        let errorMessage = httpError['message'];

        throw new NodeRPCException(response.statusCode, errorCode ? errorCode : -1, errorMessage);
      }
    }

    public async send<T>(serviceEndpoint: string, rawPayload: any, responseParser: HttpResponseParser<T> = HttpClient.DEFAULT_RESPONSE_PARSER, method?: HttpMethod): Promise<T> {
        let self = this;
        checkNotNull(serviceEndpoint, "No service endpoint specified");

        let payload = this.parsePayload(rawPayload, method);
        let options = await this.buildRequest(serviceEndpoint, method, payload);

        // Remove payload for GET requests.
        if (options.method === HttpMethod.GET) {
          payload = "";
        }

        HttpClient.LOG.initializeCID();
        HttpClient.LOG.info("HTTP Request: " + options.method + " " +  options.protocol + "//" + options.host + ":" + options.port + options.path + " withAuthorization: " + this.withAuthorization + (payload && payload != HttpClient.NO_PAYLOAD && options.method != HttpMethod.GET ? " payload: " + payload : ""));
        HttpClient.LOG.debug("HTTP Header: " + options.headers['Authorization']);

        return new Promise<T>((resolve, reject) => {
            let request = http.request(
              options,
              function(response: http.IncomingMessage) {
                const chunks = [];
                response.on('data', (chunk) => {
                  chunks.push(chunk);
                });

                response.on('end', () => {
                  try {
                    const rawContent = Buffer.concat(chunks).toString();
                    HttpClient.LOG.info("HTTP Response: Status: " + response.statusCode + (rawContent ? " response: " + rawContent : ""));

                    self.handleResponse(response, rawContent);

                    let deserialized = responseParser.deserialize(rawContent);
                    resolve(deserialized);
                  } catch(e) {
                    reject(
                      new DeserializationError("Unable to deserialize content from " + serviceEndpoint, e)
                    );
                  }
                });
              }
            );
            
            if (payload && payload != HttpClient.NO_PAYLOAD) {
              request.write(payload);
            }

            request.end();
        })
    }

    /**
     * Build Http RequestOptions from endpoint, method and payload.
     * For GET requests, the payload is added to the endpoint url.
     */
    private async buildRequest(serviceEndpoint: string, method: HttpMethod, payload: string): Promise<http.RequestOptions> {
        let requestOptions: http.RequestOptions = JSON.parse(JSON.stringify(this.httpOptions));
        if (method) {
          requestOptions.method = method;
        }
        requestOptions.path = serviceEndpoint;

        if (payload && method === HttpMethod.GET) {
          requestOptions.path += ("?" + payload);
        }

        if (this.withAuthorization) {
          try {
            let accessToken = this.serviceContext.getAccessToken();
            let canonicalAccessToken = await accessToken.getCanonicalizedAccessToken();
            //HttpClient.LOG.debug("Access Token: " + accessToken.getJwtCode());
            HttpClient.LOG.debug("Canonical Access Token: " + canonicalAccessToken);
            requestOptions.headers['Authorization'] = canonicalAccessToken;
          } catch(e) {
            HttpClient.LOG.error("Authentication error: {}", e);
            throw new UnauthorizedException("Authentication error", e);
          }
        }

        return requestOptions;
    }

    /**
     * Return provided payload as a serialized JSON object or as url
     * parameters for GET requests.
     */
    private parsePayload(payload: any, method: HttpMethod): string {
        if (payload && method === HttpMethod.GET) {
          if (typeof payload === 'string') {
            return payload;
          }
          let query = "";
          for (let prop of Object.keys(payload)) {
            if (query) {
              query += "&";
            }
            query += (prop + "=" + payload[prop]);
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

    
}