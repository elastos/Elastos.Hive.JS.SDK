import { checkNotNull } from '../utils/utils';
import { ServiceEndpoint } from './serviceEndpoint';
import { HttpResponseParser } from './httpresponseparser';
import { NodeRPCException, UnauthorizedException } from '../exceptions';
import { StreamResponseParser } from './streamresponseparser';
import { HttpMethod } from './httpmethod';
import { HttpOptions, HttpHeaders } from './httpoptions';
import { Logger } from '../utils/logger';
import axios, { Method } from "axios";

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
    public static NO_PAYLOAD = "";
    public static WITH_AUTHORIZATION = true;
    public static NO_AUTHORIZATION = false;
    public static DEFAULT_TIMEOUT = 5000;
    public static DEFAULT_PROTOCOL = "http:";
    public static DEFAULT_PORT = 9001;
    public static DEFAULT_METHOD = HttpMethod.PUT;
    // Disabled. Axios should set it automatically when running from browser and requests from Node shouldn't require this attribute.
    // The correct solution for Node requests would be to get the user-agent from the configuration to identify the calling application.
    // (Carl Duranleau - January 21st, 2022)
    //public static DEFAULT_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11";
    public static DEFAULT_HEADERS: HttpHeaders = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Connection": "Keep-Alive",

        // We don't handle chunked payloads for now since Axios doesn't support it when running in a browser.
        // We would need to add specific code to handle chunked payloads in the Node environment only. It means that, for now, download services
        // will take more memory since all the data will be pushed to memory in a single big binary buffer. (Carl Duranleau - January 21st, 2022)
        //"Transfer-Encoding": "chunked",

        //"User-Agent": HttpClient.DEFAULT_AGENT
    };

    public static DEFAULT_OPTIONS: HttpOptions = {
        method: HttpClient.DEFAULT_METHOD,
        protocol: HttpClient.DEFAULT_PROTOCOL,
        port: HttpClient.DEFAULT_PORT,
        timeout: HttpClient.DEFAULT_TIMEOUT,
        headers: HttpClient.DEFAULT_HEADERS
    };

    private withAuthorization = false;
    private serviceContext: ServiceEndpoint;
    private httpOptions: HttpOptions;
    private httpOptionsInitialized = false;

    constructor(serviceContext: ServiceEndpoint, withAuthorization: boolean, httpOptions: HttpOptions) {
        this.serviceContext = serviceContext;
        this.withAuthorization = withAuthorization;
        this.httpOptions = httpOptions;
    }

    private async getHttpOptions(): Promise<HttpOptions> {
        if (!this.httpOptionsInitialized) {
            this.httpOptions = await this.getHttpOptionsByProviderAddress(this.httpOptions);
            this.httpOptionsInitialized = true;
        }
        return this.httpOptions;
    }

    private async handleResponse(statusCode: number, content?: string): Promise<void> {

      if (statusCode >= 300) {

        if (this.withAuthorization && statusCode == 401) {
          await this.serviceContext.getAccessToken().invalidate();
        }
        if (!content) {
          throw NodeRPCException.forHttpCode(statusCode);
        }
        let errorCode = -1;
        let errorMessage = "";
        try {
          let jsonObj = JSON.parse(content);
          if (!jsonObj["error"]) {
            throw NodeRPCException.forHttpCode(statusCode, content);
          }
          let httpError = jsonObj["error"];
          errorCode = httpError['internal_code'];
          errorMessage = httpError['message'];
        } catch(e) {
          errorMessage = "Unparseable content: " + content;
        }
        throw NodeRPCException.forHttpCode(statusCode, errorMessage, errorCode ? errorCode : -1);
      }
    }

    private getMethod(method: string): Method{
        if (method.toUpperCase() === "POST") return "POST";
        if (method.toUpperCase() === "GET") return "GET";
        if (method.toUpperCase() === "DELETE") return "DELETE";
        if (method.toUpperCase() === "PUT") return "PUT";
        if (method.toUpperCase() === "PATCH") return "PATCH";
        return HttpClient.DEFAULT_METHOD;
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
        if (payload && typeof payload === 'string' && payload.includes("\\\"")) {
          HttpClient.LOG.warn("Possible double payload escaping detected.");
        }
        let isStream = ('onData' in responseParser);
        let streamParser: StreamResponseParser;
        if (isStream) {
          streamParser = (responseParser as unknown) as StreamResponseParser;
          streamParser.deserialize = HttpClient.NO_RESPONSE.deserialize;
          options.headers['Accept'] = "application/octet-stream";
        }

        HttpClient.LOG.initializeCID();
        HttpClient.LOG.info("HTTP Request: " + options.method + " " +  options.protocol + "//" + options.host + ":" + options.port + options.path + " withAuthorization: " + this.withAuthorization + (payload && options.method != HttpMethod.GET ? " payload: " + payload.toString() : ""));
        if (options.headers['Authorization']) {
          HttpClient.LOG.debug("HTTP Header: " + options.headers['Authorization']);
        }

        return new Promise<T>((resolve, reject) => {
          void axios({
              method: this.getMethod(options.method),
              url: options.protocol + "//" + options.host + ":" + options.port + options.path,
              headers: options.headers,
              responseType: isStream ? "arraybuffer" : "text",
              data: payload,
              validateStatus: (status) => { return true; },
              transitional: {
                forcedJSONParsing: false
              }
            }).then(async (response) => {
                if (isStream) {
                  HttpClient.LOG.info("HTTP Response: Status: " + response.status + " (\"STREAM\")");
                  HttpClient.LOG.debug("HTTP Response: Size: " + response.data.byteLength);
                  streamParser.onData(Buffer.from(response.data, 'binary'));
                  await self.handleResponse(response.status);
                  streamParser.onEnd();
                  resolve(null as T);
                } else {
                  const rawContent = response.data;
                  HttpClient.LOG.info("HTTP Response: Status: " + response.status);
                  if (rawContent) {
                    HttpClient.LOG.debug("HTTP response: " + rawContent);
                  }
                    await self.handleResponse(response.status, rawContent);
                  let deserialized = responseParser.deserialize(rawContent);
                  resolve(deserialized);
                }
            }).catch((error) => {
              reject(error);
            });
        });
    }

    /**
     * Build Http RequestOptions from endpoint, method and payload.
     * For GET requests, the payload is added to the endpoint url.
     */
    private async buildRequest(serviceEndpoint: string, method: HttpMethod, payload: string): Promise<HttpOptions> {
        //Clone httpOptions
        let requestOptions: HttpOptions = JSON.parse(JSON.stringify(await this.getHttpOptions()));
        if (method) {
          requestOptions.method = method;
        }
        requestOptions.path = serviceEndpoint;

        if (payload && method === HttpMethod.GET) {
          let delimiter = serviceEndpoint.includes("?") ? "&" :"?";
          requestOptions.path += (delimiter + payload);
        }

        if (this.withAuthorization) {
          try {
            let accessToken = this.serviceContext.getAccessToken();
            let canonicalAccessToken = await accessToken.getCanonicalizedAccessToken();
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
    private parsePayload(payload: any, method: HttpMethod): any {
        // No transformation needed when the payload is empty or already a string
        if (!payload || typeof payload === 'string' || Buffer.isBuffer(payload)) {
          return payload;
        }
        // Convert payload object properties to URL parameters
        if (method === HttpMethod.GET) {
          let query = "";
          for (let prop of Object.keys(payload)) {
            let value = payload[prop];
            if (value) {
              if (query) {
                query += "&";
              }
              query += (prop + "=" + value);
            }
          }
          return query;
        }
        return JSON.stringify(payload, (key, value) => {
          if (value !== null) return value
        });
    }

    private async getHttpOptionsByProviderAddress(ho: HttpOptions): Promise<HttpOptions> {
        checkNotNull(ho, "No HTTP configuration provided");
        const providerAddress = await this.serviceContext.getProviderAddress();
        const url = new URL(providerAddress);
        return {
            protocol: url.protocol,
            host: url.host.split(':')[0],
            port: url.port ? url.port : (url.protocol == 'https:' ? '443' : '80'),
            method: ho.method ?? HttpClient.DEFAULT_METHOD,
            path: url.pathname,
            headers: ho.headers ?? HttpClient.DEFAULT_HEADERS,
            timeout: ho.timeout ?? HttpClient.DEFAULT_TIMEOUT
        };
    }
}