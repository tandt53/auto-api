import {TestObject} from "@testSpec/model/testObject";
import {ApiConfig} from "@httpclient/ApiConfig";
import {ApiSpec} from "@apiSpec/ApiSpec";
import {VariableObject} from "@testSpec/model/variableObject";
import {VariableOps} from "@execution/variableOps";
import {RequestBodyObject} from "@testSpec/model/requestBodyObject";
import {request} from "@httpclient/request";

function buildUrl(url: string, vars: VariableObject[], stepVariables: VariableObject[], environment: string) {
    if (url) {
        if (VariableOps.isContainsVariable(url)) {
            return VariableOps.getValue(url, vars, stepVariables);
        }
    }
    return url;
}

function buildPathParams(pathParams: VariableObject[], vars: VariableObject[], stepVariables: VariableObject[], environment: string) {
    if (pathParams) {
        return getMap(pathParams, vars, stepVariables);
    }
    return undefined;
}

function buildQuery(query: VariableObject[], vars: VariableObject[], stepVariables: VariableObject[], environment: string) {
    if (query) {
        return getMap(query, vars, stepVariables);
    }
    return undefined;
}

function buildCookies(cookies: VariableObject[], vars: VariableObject[], stepVariables: VariableObject[], environment: string) {
    if (cookies) {
        return getMap(cookies, vars, stepVariables);
    }
    return undefined;
}

function getMap(input: VariableObject[], testVars: VariableObject[], stepVars: VariableObject[]) {
    const map: Record<string, any> = {};
    input.forEach(variable => {
        const value = variable.value;
        if (typeof value === 'string' && VariableOps.isContainsVariable(value)) {
            map[variable.key] = VariableOps.getValue(value, testVars, stepVars);
        } else {
            map[variable.key] = value;
        }
    });
    return map;
}

function buildHeaders(headers: VariableObject[], vars: VariableObject[], stepVariables: VariableObject[], environment: string) {
    if (headers) {
        return getMap(headers, vars, stepVariables);
    }
    return undefined;
}

function buildFormData(formData: VariableObject[], vars: VariableObject[], stepVariables: VariableObject[], environment: string) {
    // if (formData) {
    //     return formData.map(data => {
    //         const value = data.value;
    //         if (typeof value === 'string' && VariableOps.isContainsVariable(value)) {
    //             data.value = VariableOps.getValue(value, vars, stepVariables);
    //         }
    //         return data;
    //     });
    // }
    return undefined;
}

function buildBody(specBody: any, body: RequestBodyObject, vars: VariableObject[], stepVariables: VariableObject[], environment: string) {

    if (body) {
        switch (body.type) {
            case 'text':
                if (typeof body.data === 'string' && VariableOps.isContainsVariable(body.data)) {
                    return VariableOps.getValue(body.data, vars, stepVariables);
                }
                break;
            case 'json':
                if (typeof body.data === 'string' && VariableOps.isContainsVariable(body.data)) {
                    return JSON.parse(VariableOps.getValue(body.data, vars, stepVariables));
                }
                break;
            case 'xml':
                if (typeof body.data === 'string' && VariableOps.isContainsVariable(body.data)) {
                    return VariableOps.getValue(body.data, vars, stepVariables);
                }
                break;
            case 'json-keys':
                let sBody = specBody.body;
                for (const key in specBody) {
                    sBody = specBody[key];
                    break;
                }
                if (body.data) {
                    body.data.forEach((d: VariableObject) => {
                        const value = d.value;
                        if (typeof value === 'string' && VariableOps.isContainsVariable(value)) {
                            d.value = VariableOps.getValue(value, vars, stepVariables);
                        }
                        sBody[d.key] = d.value;
                    });
                }
                return specBody;
        }
        return body;
    }
    return undefined;
}

export async function execute(testSpec: TestObject[], apiSpecs: ApiSpec[], apiConfig: ApiConfig) {

    for (const test of testSpec) {

        const vars = test.variables;
        const steps = test.steps;
        const before = test.before;
        const after = test.after;
        const environment = test.environment;
        const type = test.type;
        const id = test.id;
        const name = test.name;
        const description = test.description;

        for (const step of steps) {
            const stepName = step.step;
            const stepDescription = step.description;
            const stepVariables = step.variables;
            const stepRequest = step.request;
            const stepResponse = step.response;

            const apiSpec = apiSpecs.find(apiSpec => apiSpec.path === stepRequest.path && apiSpec.method === stepRequest.method);
            if (apiSpec) {
                // execute
                // now we have the apiSpec that contains all spec information
                // and we also have the request object that contains the actual request
                // we can now execute the request
                apiSpec.url = buildUrl(stepRequest.url, vars, stepVariables, environment);
                apiSpec.pathParams = buildPathParams(stepRequest.pathParams, vars, stepVariables, environment);
                apiSpec.query = buildQuery(stepRequest.query, vars, stepVariables, environment);
                apiSpec.cookies = buildCookies(stepRequest.cookies, vars, stepVariables, environment);
                apiSpec.headers = buildHeaders(stepRequest.headers, vars, stepVariables, environment);
                apiSpec.formData = buildFormData(stepRequest.formData, vars, stepVariables, environment);
                apiSpec.body = buildBody(apiSpec.body, stepRequest.body, vars, stepVariables, environment);

                // execute the request
                const response = await request(apiSpec, apiConfig);
                console.log(JSON.stringify(response));

            } else {
                // new API that does not exist in the API spec -> first throw an error, later will execute request as is
            }

        }

    }
}
