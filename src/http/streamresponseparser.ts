import { HttpResponseParser } from "../http/httpresponseparser";

export interface StreamResponseParser extends HttpResponseParser<void> {
    onData(chunk: Buffer): void;
    onEnd(): void;
}