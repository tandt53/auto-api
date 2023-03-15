// import OpenAPIParser from "@readme/openapi-parser";
import OpenAPIParser from "@apidevtools/swagger-parser";
import {Api} from "./api";
import {ApiRequestOptions} from "../client/core/ApiRequestOptions";
import {OpenAPIV3} from "openapi-types";

export const getApiSpec2 = async (swaggerJson: string): Promise<any> => {
    const parser = new OpenAPIParser();
    const doc = await parser.dereference(swaggerJson);

    const apis: ApiRequestOptions[] = [];

    for (const path in doc.paths) {
        if (doc.paths.hasOwnProperty(path)) {
            const pathItem = doc.paths[path];
            for (const method in pathItem) {
                if (pathItem.hasOwnProperty(method)) {
                    const operation = pathItem[method];
                    const endpoint: Api = {
                        path,
                        method,
                        operationId: operation.operationId,
                        requestBody: operation.requestBody,
                        parameters: operation.parameters,
                        responses: operation.responses,
                        security: operation.security,
                        description: operation.description,
                        summary: operation.summary,
                        tags: operation.tags,
                        deprecated: operation.deprecated,
                        servers: operation.servers
                    };

                    const cookies = getCookies(endpoint.parameters);
                    console.log(method + " " + path + " " + JSON.stringify(cookies));

                    const headers = getHeaders(endpoint.parameters);
                    console.log(method + " " + path + " " + JSON.stringify(headers));

                    const query = getQuery(endpoint.parameters);
                    console.log(method + " " + path + " " + JSON.stringify(query));

                    const pathParams = getPath(endpoint.parameters);
                    console.log(method + " " + path + " " + JSON.stringify(pathParams));
                }
            }
        }
    }
    return apis;
}


function getCookies(parameters: OpenAPIV3.ParameterObject[]) {
    // using functional style to avoid mutation
    return parameters?.filter((param: any) => param.in === 'cookie')
        ?.reduce((result: any, param: any) => {
            result[param.name] = param.example || getTypeData(param.schema.type);
            return result;
        }, {});
}

function getHeaders(parameters: OpenAPIV3.ParameterObject[]) {
    // using functional style to avoid mutation
    return parameters?.filter((param: any) => param.in === 'header')
        ?.reduce((result: any, param: any) => {
            result[param.name] = param.example || getTypeData(param.schema.type);
            return result;
        }, {});
}

function getQuery(parameters: OpenAPIV3.ParameterObject[]) {
    // using functional style to avoid mutation
    return parameters?.filter((param: any) => param.in === 'query')
        ?.reduce((result: any, param: any) => {
            result[param.name] = param.example || getTypeData(param.schema.type);
            return result;
        }, {});
}

function getPath(parameters: OpenAPIV3.ParameterObject[]) {
    // using functional style to avoid mutation
    return parameters?.filter((param: any) => param.in === 'path')
        ?.reduce((result: any, param: any) => {
            result[param.name] = param.example || getTypeData(param.schema.type);
            return result;
        }, {});
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
