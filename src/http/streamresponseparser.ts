import { HttpResponseParser } from "../http/httpresponseparser";

export interface StreamResponseParser extends HttpResponseParser<void> {
    onData(chunk: any): void;
    onEnd(): void;
}