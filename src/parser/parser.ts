import {OpenAPIV3} from 'openapi-types';
import SwaggerParser from '@apidevtools/swagger-parser';
import {ApiRequestOptions} from "../httpclient/ApiRequestOptions";

/**
 * Parse swagger json to ApiRequestOptions[]
 * @param swaggerJson
 */
export async function parseSwaggerJson(swaggerJson: string): Promise<ApiRequestOptions[]> {
    const apiRequestOptions: ApiRequestOptions[] = [];

    const api = await SwaggerParser.parse(swaggerJson) as OpenAPIV3.Document;
    const paths = api.paths;
    for (const path in paths) {
        if (paths.hasOwnProperty(path)) {
            const pathItem = paths[path];
            for (const method in pathItem) {
                if (pathItem.hasOwnProperty(method)) {
                    const operation = pathItem[method];
                    const url = path;
                    const operationId = operation.operationId;
                    const parameters = operation.parameters;
                    const requestOptions: ApiRequestOptions = {
                        method: method.toUpperCase() as ApiRequestOptions['method'],
                        url,
                        operationId,
                    };

                    if (parameters) {
                        for (const parameter of parameters) {
                            switch (parameter.in) {
                                case 'path':
                                    if (!requestOptions.path) {
                                        requestOptions.path = {};
                                    }
                                    requestOptions.path[parameter.name] = parameter.example || getTypeData(parameter.type) || `{${parameter.name}}`;
                                    break;
                                case 'query':
                                    if (!requestOptions.query) {
                                        requestOptions.query = {};
                                    }
                                    requestOptions.query[parameter.name] = parameter.example || getTypeData(parameter.type) || `{${parameter.name}}`;
                                    break;
                                case 'header':
                                    if (!requestOptions.headers) {
                                        requestOptions.headers = {};
                                    }
                                    requestOptions.headers[parameter.name] = parameter.example || getTypeData(parameter.type) || `{${parameter.name}}`;
                                    break;
                                case 'cookie':
                                    if (!requestOptions.cookies) {
                                        requestOptions.cookies = {};
                                    }
                                    requestOptions.cookies[parameter.name] = parameter.example || getTypeData(parameter.type) || `{${parameter.name}}`;
                                    break;
                                case 'formData':
                                    if (!requestOptions.formData) {
                                        requestOptions.formData = {};
                                    }
                                    requestOptions.formData[parameter.name] = parameter.example || getTypeData(parameter.type) || `{${parameter.name}}`;
                                    break;
                                case 'body':
                                    if (parameter.schema) {
                                        requestOptions.body = getBodyObject(parameter.schema, api);
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    // parse request body and media type
                    // body will take default to application/json
                    if (operation.requestBody) {
                        const requestBody = operation.requestBody;
                        if (requestBody.content) {
                            const content = requestBody.content;
                            for (const mediaType in content) {
                                // just take the first media type
                                if (content.hasOwnProperty(mediaType)) {
                                    const mediaTypeObject = content[mediaType];
                                    if (mediaTypeObject.schema) {
                                        requestOptions.body = getBodyObject(mediaTypeObject.schema, api);
                                        requestOptions.mediaType = mediaType;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    apiRequestOptions.push(requestOptions);
                }
            }
        }
    }
    return apiRequestOptions;
}

function getBodyObject(schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject, api: OpenAPIV3.Document): any {
    if ('$ref' in schema) {
        const ref = schema.$ref;
        const definition = api.components?.schemas?.[ref.split('/').pop()!];
        if (definition) {
            return getBodyObject(definition, api);
        }
        return {};
    }

    if (schema.type === 'object' && schema.properties) {
        const obj: Record<string, any> = {};
        Object.entries(schema.properties).forEach(([key, property]) => {
            obj[key] = getBodyObject(property, api);
        });
        return obj;
    }

    if (schema.type === 'array' && schema.items) {
        const arr: any[] = [];
        arr.push(getBodyObject(schema.items, api));
        return arr;
    }

    if (schema.type === 'string') {
        return schema.example || 'string';
    }

    if (schema.type === 'number' || schema.type === 'integer') {
        return schema.example || 0;
    }

    return schema.default || '';
}
function getTypeData(type: string): any {
    switch (type) {
        case 'string':
            return 'string';
        case 'number':
        case 'integer':
            return 0;
        case 'boolean':
            return false;
        case 'array':
            return [];
        case 'object':
            return {};
        default:
            return 'string';
    }
}
