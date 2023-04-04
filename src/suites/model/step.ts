import { ApiSpec } from "../../api/ApiSpec";
import { Expect } from "./expect";
import { Extract } from "./extract";

export interface Step {
    name: string,
    id: string,
    description: string,
    variables: Record<string, any>,
    type: string,
    precondition: Record<string, any>, 
    postcondition: Record<string, any>,
    api: ApiSpec,
    expect: Expect[],
    extract: Extract[],
}