import {RequestObject} from "./requestObject";
import {ResponseObject} from "./responseObject";
import {VariableObject} from "./variableObject";

export interface StepObject {
    step: string,
    description?: string,
    variables?: VariableObject[],
    request: RequestObject;
    response?: ResponseObject
}
