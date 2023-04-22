import {StepObject} from "./stepObject";
import {VariableObject} from "@testSpec/model/variableObject";

export interface TestObject {
    name: string,
    description: string,
    id: string,
    type: 'api' | 'flow'
    variables: VariableObject[],
    before?: StepObject[],
    after?: StepObject[],
    steps?: StepObject[],
    environment: string,
}
