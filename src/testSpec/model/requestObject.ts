import {RequestBodyObject} from "./requestBodyObject";
import {VariableObject} from "./variableObject";

export interface RequestObject {
    url?: string,
    path: string
    method: string,
    pathParams?: VariableObject[]
    query?: VariableObject[]
    cookies?: VariableObject[]
    headers?: VariableObject[]
    formData?: VariableObject[]
    body?: RequestBodyObject
}
