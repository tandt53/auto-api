import {VariableObject} from "./variableObject";

export interface RequestBodyObject {
    type: 'text' | 'json' | 'xml' | 'json-keys',
    data: string | VariableObject[]
}
