import OpenAPIParser from "@readme/openapi-parser";
import {Api} from "./api";

export const getApiSpec = async (swaggerJson: string): Promise<any> => {
    const parser = new OpenAPIParser();
    const doc = await parser.dereference(swaggerJson);

    const apis: Api[] = [];

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
                    apis.push(endpoint);
                }
            }
        }
    }
    return apis;
}

