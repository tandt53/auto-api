
export type ApiConfig = {
    /**
     * The base URL of the API.
     */
    baseUrl: string;
    /**
     * The base path of the API.
     */
    basePath: string;

    /**
     * The default headers to be sent with every request.
     */
    defaultHeaders: Record<string, string>;

}
