export class HttpClient {
    private connectTimeout = 30000;
    private readTimeout = 30000;

    public setConnectTimeout(timeout: number) {
        this.connectTimeout = timeout;
    }

    public setReadTimeout(timeout: number) {
        this.readTimeout = timeout;
    }
}