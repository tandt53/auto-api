import {StepObject} from "./stepObject";

export interface TestObject {
    name: string,
    description: string,
    id: string,
    type: 'api' | 'flow'
    variables: Record<string, any>,
    before?: StepObject[],
    after?: StepObject[],
    apis?: StepObject[],
    environment: string,
}
