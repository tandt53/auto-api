import {Step} from "./step";

export interface TestSuite {
    name: string,
    description: string,
    id: string,
    type: 'api' | 'flow'
    variables: Record<string, any>,
    before?: Step[],
    after?: Step[],
    beforeEach?: Step[],
    afterEach?: Step[],
    apis?: Step[],
    environment: string,
}
