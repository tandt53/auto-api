import axios, {AxiosError, AxiosRequestConfig} from "axios";
import {ApiSpec, HttpMethod} from "@apiSpec/ApiSpec";
import {ApiResult} from "./ApiResult";
import {ApiConfig} from "./ApiConfig";
import qs from 'qs';
import FormData from 'form-data';
import fs from "fs";
import {XMLBuilder} from "fast-xml-parser";
import {ApiSpecWithRules} from "@apiSpec/ApiSpecWithRules";


/**
 * Send request
 * @param specs
 * @param config
 */
export const request = async (specs: ApiSpec, config: ApiConfig): Promise<ApiResult> => {
    const axiosRequestConfig: AxiosRequestConfig = {
        url: getUrl(specs, config),
        method: specs.method,
        headers: getHeaders(specs, config),
        data: getBody(specs, config),
    }

    console.log(getCurl(specs, config));

    try {
        const response = await axios.request(axiosRequestConfig);
        return {
            status: response.status,
            statusText: response.statusText,
            url: response.config.url,
            headers: Object.fromEntries(Object.entries(response.headers)),
            body: response.data
        }
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            return {
                status: axiosError.response.status,
                statusText: axiosError.response.statusText,
                url: axiosError.response.config.url,
                headers: Object.fromEntries(Object.entries(axiosError.response.headers)),
                body: axiosError.response.data
            };
        }
        throw error;
    }

}

// @ts-ignore
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
    // navigate to the first key of body -> for json, form-urlencoded
    // for example, body = {user: {id: 1, username: 'abc'}}
    // then body = {id: 1, username: 'abc'}
    let body = specs.body;
    for (const key in body) {
        body = body[key];
        break;
    }
    switch (specs.mediaType) {
        case 'application/json':
            return body;
        case 'application/x-www-form-urlencoded':
            return qs.stringify(body);
        case 'application/octet-stream':
            return Buffer.from(specs.body);
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
        case 'application/xml':
            const builder = new XMLBuilder({
                ignoreAttributes: false
            });
            return builder.build(specs.body);
        default:
            return specs.body;
    }
}


/**
 * Get path
 * if pathParams has value, replace path with pathParams
 * for example, path = '/api/v1/users/{userId}', pathParams = {userId: '123'}
 * then result = '/api/v1/users/123'
 *  @param path
 * @param spec
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

function getEncodedUrl(apiSpec: ApiSpec) {
    if (apiSpec.mediaType === 'application/x-www-form-urlencoded') {
        let body = apiSpec.body;
        for (const key in body) {
            body = body[key];
            break;
        }
        return qs.stringify(body);
    }
}

/**
 * URL is composed of baseUrl, path and query
 * for example, baseUrl = 'http://localhost:8080', path = '/api/v1/users', query = 'name=abc&age=18'
 * then result = 'http://localhost:8080/api/v1/users?name=abc&age=18'
 *
 * In general, most of the APIs use the same baseUrl, so we can set baseUrl in ApiConfig.
 * However, you might want to use different baseUrl for some APIs (3rd parties), so we can define it in ApiSpec and use it instead of baseUrl in ApiConfig.
 * @param apiSpec
 * @param config
 */
function getUrl(apiSpec: ApiSpec, config: ApiConfig): string {
    const path = getPath(apiSpec.path, apiSpec);
    const query = getQuery(apiSpec);
    const encodedUrl = getEncodedUrl(apiSpec);

    let hostname = apiSpec.url ? apiSpec.url : config.baseUrl;
    if (hostname.endsWith('/')) {
        hostname = hostname.substring(0, hostname.length - 1);
    }


    if (path.startsWith('/')) {
        return `${hostname}${path}${query ? '?' + query : ''}${encodedUrl ? `?${encodedUrl}` : ''}`;
    } else {
        return `${hostname}/${path}${query ? '?' + query : ''}${encodedUrl ? `?${encodedUrl}` : ''}`;
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
    headers['Accept'] = 'application/json';
    headers['Content-type'] = specs.mediaType;

    return headers;

}


// ========================= API SPEC TO CURL ===================================
export function getCurl(apiSpec: ApiSpecWithRules, config: ApiConfig): string {
    const url = getUrl(apiSpec, config);
    const headers = curlHeaders(getHeaders(apiSpec, config));
    const method = curlMethod(apiSpec.method);
    const body = curlBody(apiSpec, true);
    const formData = curlFormData(apiSpec);

    return prettyCurl(url, headers, method, body, formData);
    // return curl(url, headers, method, body, formData);
}

function curlHeaders(headers: Record<string, string>): string[] {
    return Object.entries(headers).map(([key, value]) => `-H '${key}: ${value}'`);
}

function curlMethod(method: HttpMethod) {
    return `-X ${method}`;
}

function curlBody(apiSpec: ApiSpecWithRules, isPretty = false) {
    let body = apiSpec.body;
    for (const key in body) {
        body = body[key];
        break;
    }
    if (!body || apiSpec.mediaType === 'multipart/form-data' || apiSpec.mediaType === 'application/x-www-form-urlencoded') {
        return '';
    }
    if (apiSpec.mediaType === 'application/json') {
        return `-d '${isPretty ? JSON.stringify(body, null, 10) : JSON.stringify(body)}'`;
    } else if (apiSpec.mediaType === 'application/xml' || apiSpec.mediaType === 'text/xml') {
        const builder = new XMLBuilder({
            ignoreAttributes: false
        });
        return `-d ${builder.build(apiSpec.body)}`;
    } else {
        return `-d '${JSON.stringify(body)}'`;
    }
}

function curlFormData(apiSpec: ApiSpecWithRules): string[] {
    if (apiSpec.mediaType === 'multipart/form-data') {
        return Object.entries(apiSpec.formData).map(([key, value]) => `-F '${key}=${value}'`);
    } else {
        return [''];
    }
}

// @ts-ignore
function curl(url: string, headers: string[], method: string, body: string, formData: string[]): string {
    const array = [];
    array.push(`curl ${method} ${url}`);
    if (headers[0])
        array.push(...headers);
    if (body)
        array.push(body);
    if (formData[0])
        array.push(...formData);
    return array.join(' ');
}

function prettyCurl(url: string, headers: string[], method: string, body: string, formData: string[]): string {
    const array = [];
    array.push(`curl ${method} ${url}`);
    if (headers[0])
        array.push(...headers);
    if (body)
        array.push(body);
    if (formData[0])
        array.push(...formData);
    return array.join(' \t \\ \n\t ');
}
