import {Rule} from "./Rule";
import {ApiRequestOptions} from "../httpclient/ApiRequestOptions";

export interface ApiRequestOptionsWithRules extends ApiRequestOptions {
    formDataRules?: Record<any, Rule>;
    pathRules?: Record<string, Rule>;
    queryRules?: Record<string, Rule>;
    headersRules?: Record<string, Rule>;
    bodyRules?: Rule;
}
