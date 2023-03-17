/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ApiRequestOptions = {
    method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';
    url: string;
    operationId?: string;
    path?: Record<string, any>;
    cookies?: Record<string, any>;
    headers?: Record<string, any>;
    query?: Record<string, any>;
    formData?: Record<string, any>;
    body?: any;
    mediaType?: string;
    responseHeader?: string;
    errors?: Record<number, string>;
};
