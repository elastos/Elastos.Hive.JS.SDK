export type HttpHeaders = Record<string, string>;

export interface HttpOptions {
    protocol?: string | null | undefined;
    host?: string | null | undefined;
    port?: number | string | null | undefined;
    method?: string | undefined;
    path?: string | null | undefined;
    headers?: HttpHeaders | undefined;
    agent?: string | null | undefined;
    timeout?: number | undefined;
}