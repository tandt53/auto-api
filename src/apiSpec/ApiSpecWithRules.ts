import {ApiSpec} from "./ApiSpec";
import {Rule} from "./Rule";

export interface ApiSpecWithRules extends ApiSpec {
    formDataRules?: Record<any, Rule>;
    pathRules?: Record<string, Rule>;
    queryRules?: Record<string, Rule>;
    headersRules?: Record<string, Rule>;
    bodyRules?: Rule;
}
