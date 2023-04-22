import {VariableObject} from "./variableObject";

export interface RequestBodyObject {
    type: 'text' | 'json' | 'xml' | 'json-keys',
    value?: string,
    data?: VariableObject[]
}
