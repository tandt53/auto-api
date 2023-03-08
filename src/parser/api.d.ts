import {OpenAPIV3} from "openapi-types";

export interface Api {
    path: string;
    method: string;
    operationId: string;
    requestBody?: OpenAPIV3.RequestBodyObject;
    parameters?: OpenAPIV3.ParameterObject[];
    responses?: OpenAPIV3.ResponsesObject;
    security?: OpenAPIV3.SecurityRequirementObject[];
    description?: string;
    summary?: string;
    tags?: string[];
    deprecated?: boolean;
    servers?: OpenAPIV3.ServerObject[];
}
