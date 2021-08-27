export interface HttpResponseParser<T> {
    deserialize(content: any): T;
    rawContent(content: any): any;
}