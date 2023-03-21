// import {OpenAPIV3} from 'openapi-types';
// import SwaggerParser from '@apidevtools/swagger-parser';
// import {ApiRequestOptionsWithRules} from "../dataType/ApiRequestOptionWithRule";
// import {Rule} from "../dataType/Rule";
//
// /**
//  * Parse swagger json to ApiRequestOptionsWithRules[]
//  * @param swaggerJson
//  */
// export async function parseSwaggerJson(swaggerJson: string): Promise<ApiRequestOptionsWithRules[]> {
//     const apiRequestOptions: ApiRequestOptionsWithRules[] = [];
//
//     const api = await SwaggerParser.parse(swaggerJson) as OpenAPIV3.Document;
//     const paths = api.paths;
//     for (const path in paths) {
//         if (paths.hasOwnProperty(path)) {
//             const pathItem = paths[path];
//             for (const method in pathItem) {
//                 if (pathItem.hasOwnProperty(method)) {
//                     const operation = pathItem[method];
//                     const url = path;
//                     const operationId = operation.operationId;
//                     const parameters = operation.parameters;
//                     const options: ApiRequestOptionsWithRules = {
//                         method: method.toUpperCase() as ApiRequestOptionsWithRules['method'],
//                         url,
//                         operationId,
//                     };
//                     if (parameters) {
//                         for (const parameter of parameters) {
//                             switch (parameter.in) {
//                                 case 'path':
//                                     if (!options.path) {
//                                         options.path = {};
//                                         options.pathRules = {};
//                                     }
//                                     if (!options.pathRules) {
//                                         options.pathRules = {};
//                                     }
//                                     options.path[parameter.name] = parameter.example || getTypeData(parameter.type) || `{${parameter.name}}`;
//                                     options.pathRules[parameter.name] = {
//                                         type: parameter.schema.type,
//                                         required: parameter.required,
//                                     };
//                                     break;
//
//                                 case 'query':
//                                     if (!options.query) {
//                                         options.query = {};
//                                     }
//                                     if (!options.queryRules) {
//                                         options.queryRules = {};
//                                     }
//                                     options.query[parameter.name] = parameter.example || getTypeData(parameter.schema.type) || `{${parameter.name}}`;
//                                     const name = parameter.name;
//                                     options.queryRules[name] = {
//                                         type: parameter.schema.type,
//                                         required: parameter.required,
//                                     }
//                                     break;
//
//                                 case 'header':
//                                     if (!options.headers) {
//                                         options.headers = {};
//                                     }
//                                     if (!options.headersRules) {
//                                         options.headersRules = {};
//                                     }
//
//                                     options.headers[parameter.name] = parameter.example || getTypeData(parameter.type) || `{${parameter.name}}`;
//                                     options.headersRules[parameter.name] = {
//                                         type: parameter.schema.type,
//                                         required: parameter.required,
//                                     }
//                                     break;
//
//                                 case 'cookie':
//                                     if (!options.cookies) {
//                                         options.cookies = {};
//                                     }
//                                     if (!options.headersRules) {
//                                         options.headersRules = {};
//                                     }
//                                     options.cookies[parameter.name] = parameter.example || getTypeData(parameter.type) || `{${parameter.name}}`;
//                                     options.headersRules[parameter.name] = {
//                                         type: parameter.schema.type,
//                                         required: parameter.required,
//                                     }
//                                     break;
//
//                                 case 'formData':
//                                     if (!options.formData) {
//                                         options.formData = {};
//                                     }
//                                     if (!options.formDataRules) {
//                                         options.formDataRules = {};
//                                     }
//                                     options.formData[parameter.name] = parameter.example || getTypeData(parameter.type) || `{${parameter.name}}`;
//                                     options.formDataRules[parameter.name] = {
//                                         type: parameter.type,
//                                         required: parameter.required,
//                                     }
//                                     break;
//
//                                 case 'body':
//                                     if (parameter.schema) {
//                                         const bodyObject = getBodyObject(parameter.schema, api);
//                                         options.body = bodyObject.body;
//                                         options.bodyRules = bodyObject.rule;
//                                     }
//                                     break;
//                                 default:
//                                     break;
//                             }
//                         }
//                     }
//                     // parse request body and media type
//                     // body will take default to application/json
//                     if (operation.requestBody) {
//                         const requestBody = operation.requestBody;
//                         if (requestBody.content) {
//                             const content = requestBody.content;
//                             for (const mediaType in content) {
//                                 // just take the first media type
//                                 if (content.hasOwnProperty(mediaType)) {
//                                     const mediaTypeObject = content[mediaType];
//                                     if (mediaTypeObject.schema) {
//                                         const bodyObject = getBodyObject(mediaTypeObject.schema, api);
//                                         options.body = bodyObject.body;
//                                         options.bodyRules = bodyObject.rule;
//                                         options.mediaType = mediaType;
//                                     }
//                                 }
//                                 break;
//                             }
//                         }
//                     }
//                     apiRequestOptions.push(options);
//                 }
//             }
//         }
//     }
//     return apiRequestOptions;
// }
//
// function getBodyObject(schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject, api: OpenAPIV3.Document): { body: any, rule: Rule } {
//     if ('$ref' in schema) {
//         const ref = schema.$ref;
//         const definition = api.components?.schemas?.[ref.split('/').pop()!];
//         if (definition) {
//             return getBodyObject(definition, api);
//         }
//         return {body: undefined, rule: undefined};
//     }
//
//     if (schema.type === 'object' && schema.properties) {
//         const obj: Record<string, any> = {};
//         const rule: Rule = {type: 'object'};
//         Object.entries(schema.properties).forEach(([key, property]) => {
//             const bodyO = getBodyObject(property, api);
//             obj[key] = bodyO.body;
//             rule[key] = bodyO.rule;
//         });
//         return {body: obj, rule};
//     }
//
//     if (schema.type === 'array' && schema.items) {
//         const arr: any[] = [];
//         const rule: Rule = {type: 'array'};
//         const bodyO = getBodyObject(schema.items, api);
//         arr.push(bodyO.body);
//         rule.items = bodyO.rule;
//         return {body: arr, rule};
//     }
//
//     if (schema.type === 'string') {
//         return {body: schema.example || 'string', rule: {type: 'string'}};
//     }
//
//     if (schema.type === 'number' || schema.type === 'integer') {
//         return {body: schema.example || 0, rule: {type: 'number'}};
//     }
//
//     return {body: schema.default || '', rule: {type: 'string'}};
// }
//
// function getTypeData(type: string): any {
//     switch (type) {
//         case 'string':
//             return 'string';
//         case 'number':
//         case 'integer':
//             return 0;
//         case 'boolean':
//             return false;
//         case 'array':
//             return [];
//         case 'object':
//             return {};
//         default:
//             return 'string';
//     }
// }
