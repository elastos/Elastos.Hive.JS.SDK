import * as http from 'http';
import { AppContext } from './security/appcontext';

export class HttpClient {
    private static HTTP_TIMEOUT = 30000;

    private context: AppContext;
    private providerAddress: string;

    constructor(context: AppContext, providerAddress: string) {
        this.context = context;
        this.providerAddress = providerAddress;
    }

    public send(request: http.RequestOptions): http.IncomingMessage {
        let headers: http.OutgoingHttpHeaders;
        request.headers = {

        }
        request.timeout = HttpClient.HTTP_TIMEOUT;
        return null;
    }

    private setupConnection openConnection(urlPath: string): void {
		let url = this.providerAddress + urlPath;
		console.log("open connection with URL: " + url + " and method: PUT");

		HttpURLConnection urlConnection = (HttpURLConnection) new URL(url).openConnection();
		urlConnection.setRequestMethod("PUT");
		urlConnection.setRequestProperty("User-Agent",
				"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11");
		urlConnection.setConnectTimeout(5000);
		urlConnection.setReadTimeout(5000);

		urlConnection.setDoOutput(true);
		urlConnection.setDoInput(true);
		urlConnection.setUseCaches(false);

		urlConnection.setRequestProperty("Transfer-Encoding", "chunked");
		urlConnection.setRequestProperty("Connection", "Keep-Alive");
		urlConnection.setRequestProperty("Authorization", getAccessToken().getCanonicalizedAccessToken());

		urlConnection.setChunkedStreamingMode(0);

		return urlConnection;
	}
}