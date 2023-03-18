import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {ApiSpec} from "./ApiSpec";
import {ApiResult} from "./ApiResult";
import {ApiConfig} from "./ApiConfig";
import qs from 'qs';
import FormData from 'form-data';
import fs from "fs";


/**
 * Get body
 * if mediaType is application/json, convert body to JSON string
 * if mediaType is multipart/form-data, convert body to FormData
 * if mediaType is application/x-www-form-urlencoded, convert body to URLSearchParams
 * if mediaType is application/octet-stream, convert body to Buffer
 * @param specs
 * @param config
 */
function getBody(specs: ApiSpec, config: ApiConfig) {
    switch (specs.mediaType) {
        case 'application/json':
            return JSON.stringify(specs.body);
        case 'multipart/form-data':
            const formData = new FormData();
            for (const key in specs.formData) {
                const formObj = specs.formData[key];
                if (formObj.format === 'binary') {
                    formData.append(key, fs.createReadStream(formObj.value));
                } else {
                    formData.append(key, formObj.value);
                }
            }
            return formData;
        case 'application/x-www-form-urlencoded':
            return qs.stringify(specs.body);
        case 'application/octet-stream':
            return Buffer.from(specs.body);
        default:
            return specs.body;
    }
}

export const request = async (specs: ApiSpec, config: ApiConfig): Promise<ApiResult> => {
    // may consider some default config from .evn or .json or .properties

    // convert ApiSpec to AxiosRequestConfig
    const axiosRequestConfig: AxiosRequestConfig = {
        url: getUrl(specs, config),
        method: specs.method,
        headers: getHeaders(specs, config),
        data: getBody(specs, config),
    }

    // send request with axios
    const response = await axios.request(axiosRequestConfig);

    // convert AxiosResponse to ApiResult
    const apiResult: ApiResult = {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        headers: Object.fromEntries(Object.entries(response.headers)),
        body: response.data
    }

    return apiResult;
}


/**
 * Get path
 * if pathParams has value, replace path with pathParams
 * for example, path = '/api/v1/users/{userId}', pathParams = {userId: '123'}
 * then result = '/api/v1/users/123'
 *  @param path
 * @param pathParams
 */
function getPath(path: string, spec: ApiSpec): string {
    let result = path;
    if (!spec.pathParams) {
        for (const key in spec.pathParams) {
            result = result.replace(`{${key}}`, spec.pathParams[key]);
        }
    }
    return result;
}

/**
 * Get query
 * for example, query = {name: 'abc', age: 18}
 * then result = 'name=abc&age=18'
 *
 * @param spec
 */
function getQuery(spec: ApiSpec): string {
    let query = '';
    if (spec.query) {
        query = Object.entries(spec.query).map(([key, value]) => `${key}=${value}`).join('&');
    }
    return query;
}

/**
 * Get url
 * Url is composed of baseUrl, path and query
 * for example, baseUrl = 'http://localhost:8080', path = '/api/v1/users', query = 'name=abc&age=18'
 * then result = 'http://localhost:8080/api/v1/users?name=abc&age=18'
 *
 * In general, most of APIs use the same baseUrl, so we can set baseUrl in ApiConfig.
 * However, you might want to use different baseUrl for some APIs (3rd parties), so we can define it in ApiSpec and use it instead of baseUrl in ApiConfig.
 * @param apiSpec
 * @param config
 */
function getUrl(apiSpec: ApiSpec, config: ApiConfig): string {
    const path = getPath(apiSpec.path, apiSpec);
    const query = getQuery(apiSpec);

    let hostname = apiSpec.url ? apiSpec.url : config.baseUrl;
    if (hostname.endsWith('/')) {
        hostname = hostname.substring(0, hostname.length - 1);
    }

    if (path.startsWith('/')) {
        return `${hostname}${path}${query ? '?' + query : ''}`;
    } else {
        return `${hostname}/${path}${query ? '?' + query : ''}`;
    }
}

/**
 * Get Headers
 * Parse default headers in ApiConfig
 * Parse headers in ApiSpec
 * Merge headers in ApiSpec to default headers
 *
 *
 * Add extra header for different media type
 * - application/json: Content-Type: application/json
 * - multipart/form-data: Content-Type: multipart/form-data
 * - application/x-www-form-urlencoded: Content-Type: application/x-www-form-urlencoded
 * - text/plain: Content-Type: text/plain
 * - text/html: Content-Type: text/html
 * - text/xml: Content-Type: text/xml
 * - application/xml: Content-Type: application/xml
 * - application/octet-stream: Content-Type: application/octet-stream
 * - application/pdf: Content-Type: application/pdf
 *
 * //TODO this is not implemented
 * Add headers for authentication
 * - username and password
 * - token
 * - oauth
 * - ...
 * @param specs
 * @param config
 */
function getHeaders(specs: ApiSpec, config: ApiConfig): Record<string, string> {
    const headers: Record<string, string> = {};

    const defaultHeaders = config.defaultHeaders;
    const specHeaders = specs.headers;
    // copy default headers and spec headers to headers
    Object.assign(headers, defaultHeaders, specHeaders);

    // add extra header for different media type
    headers['Accept'] = specs.mediaType;

    return headers;

}
