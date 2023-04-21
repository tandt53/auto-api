export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';

/**
 * ApiSpec is the specification of an API call.
 */
export interface ApiSpec {
    operationId: string,
    url?: string,
    path: string,
    method: HttpMethod,
    pathParams?: Record<string, any>,
    query?: Record<string, any>,
    cookies?: Record<string, any>,
    headers?: Record<string, any>,
    formData?: Record<string, FormDataItem>,
    body?: any,
    mediaType?: string,
    responseHeader?: string,
    errors?: Record<number, string>,

}


export type FormDataItem = {
    value: any,
    type: string,
    format: string,
}
