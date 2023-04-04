import { Step } from "./step";

export interface Test {
    name: string,
    id: string,
    description: string,
    variables: Record<string, any>,
    steps: Step[],
}
