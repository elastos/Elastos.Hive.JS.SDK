export interface HttpResponseParser<T> {
    deserialize(content: any): T;
}