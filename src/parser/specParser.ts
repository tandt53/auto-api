/**
 * Parse the swagger json to ApiSpecWithRules[]
 * @param swaggerJson
 */
import SwaggerParser from "@apidevtools/swagger-parser";
import {OpenAPIV3} from "openapi-types";
import {Rule} from "@apiSpec/Rule";
import {ApiSpecWithRules} from "@apiSpec/ApiSpecWithRules";
import {ApiSpec} from "@apiSpec/ApiSpec";

export async function specParser(swaggerJson: string): Promise<ApiSpecWithRules[]> {
    const apiSpecs: ApiSpecWithRules[] = [];

    const api = await SwaggerParser.parse(swaggerJson) as OpenAPIV3.Document;
    const paths = api.paths;
    for (const path in paths) {
        if (paths.hasOwnProperty(path)) {
            const pathItem = paths[path];
            for (const method in pathItem) {
                if (pathItem.hasOwnProperty(method)) {
                    const operation = pathItem[method];
                    const operationId = operation.operationId;
                    const parameters = operation.parameters;
                    const apiSpec: ApiSpecWithRules = {
                        path,
                        method: method.toUpperCase() as ApiSpec['method'],
                        operationId
                    };
                    if (parameters) {
                        for (const parameter of parameters) {
                            switch (parameter.in) {
                                case 'path':
                                    if (!apiSpec.pathParams) {
                                        apiSpec.pathParams = {};
                                    }
                                    apiSpec.pathParams[parameter.name] = parameter.example || getData(parameter.type) || `{${parameter.name}}`;
                                    break;
                                case 'query':
                                    if (!apiSpec.query) {
                                        apiSpec.query = {};
                                    }
                                    apiSpec.query[parameter.name] = parameter.example || getData(parameter.schema.type) || `{${parameter.name}}`;
                                    break;
                                case 'header':
                                    if (!apiSpec.headers) {
                                        apiSpec.headers = {};
                                    }
                                    apiSpec.headers[parameter.name] = parameter.example || getData(parameter.schema.type) || `{${parameter.name}}`;
                                    break;
                                case 'cookie':
                                    if (!apiSpec.cookies) {
                                        apiSpec.cookies = {};
                                    }
                                    apiSpec.cookies[parameter.name] = parameter.example || getData(parameter.schema.type) || `{${parameter.name}}`;
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
                                        const bodyObject = getBodyObject(mediaTypeObject.schema, api);
                                        apiSpec.body = bodyObject.body;
                                        apiSpec.bodyRules = bodyObject.rule;
                                        apiSpec.mediaType = mediaType;
                                    }
                                }
                                break;
                            }
                        }
                    }

                    apiSpecs.push(apiSpec);
                }
            }
        }
    }
    return apiSpecs;
}

function getBodyObject(schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject, api: OpenAPIV3.Document): { body: any, rule: Rule } {
    if ('$ref' in schema) {
        const ref = schema.$ref;
        const definition = api.components?.schemas?.[ref.split('/').pop()!];
        if (definition) {
            return getBodyObject(definition, api);
        }
        return {body: undefined, rule: undefined};
    }

    if (schema.type === 'object' && schema.properties) {
        const obj: Record<string, any> = {};
        const rule: Rule = {type: 'object'};
        Object.entries(schema.properties).forEach(([key, property]) => {
            const bodyO = getBodyObject(property, api);
            obj[key] = bodyO.body;
            rule[key] = bodyO.rule;
        });
        if (schema.xml) {
            const xmlObj: Record<string, any> = {};
            const xmlRule: Rule = {type: 'object'};
            const key = schema.xml.name || 'xml';
            xmlObj[key] = obj;
            xmlRule[key] = rule;
            return {body: xmlObj, rule: xmlRule};
        }
        return {body: obj, rule};
    }

    if (schema.type === 'array' && schema.items) {
        const arr: any[] = [];
        const rule: Rule = {type: 'array'};
        const bodyO = getBodyObject(schema.items, api);
        arr.push(bodyO.body);
        rule.items = bodyO.rule;
        return {body: arr, rule};
    }

    if (schema.type === 'string') {
        return {body: schema.example || 'string', rule: {type: 'string', format: schema.format}};
    }

    if (schema.type === 'number' || schema.type === 'integer') {
        return {body: schema.example || 0, rule: {type: 'number', format: schema.format}};
    }

    return {body: schema.default || '', rule: {type: 'string', format: schema.format}};
}

function getData(type: string): any {
    switch (type) {
        case 'string':
            return '';
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
            return '';
    }
}
