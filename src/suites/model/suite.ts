import { Test } from "./test";

export interface Suite{
    name: string,
    description: string,
    id: string,
    tests: Test[],
    variables: Record<string, any>,
    environment: string,
}
