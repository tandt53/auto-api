import {TestObject} from "@testSpec/model/testObject";
import {ApiConfig} from "@httpclient/ApiConfig";
import {ApiSpec} from "@apiSpec/ApiSpec";
import {VariableObject} from "@testSpec/model/variableObject";
import {VariableOps} from "@execution/variableOps";
import {RequestBodyObject} from "@testSpec/model/requestBodyObject";
import {request} from "@httpclient/request";
import jsonpath from 'jsonpath';
import {ExtractItemObject} from "@testSpec/model/extractItemObject";

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
    //TODO: implement
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

        const testVariables = test.variables;
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
                // now we have the apiSpec that contains all spec information,
                // and we also have the request object that contains the actual request
                // we can now execute the request
                apiSpec.url = buildUrl(stepRequest.url, testVariables, stepVariables, environment);
                apiSpec.pathParams = buildPathParams(stepRequest.pathParams, testVariables, stepVariables, environment);
                apiSpec.query = buildQuery(stepRequest.query, testVariables, stepVariables, environment);
                apiSpec.cookies = buildCookies(stepRequest.cookies, testVariables, stepVariables, environment);
                apiSpec.headers = buildHeaders(stepRequest.headers, testVariables, stepVariables, environment);
                apiSpec.formData = buildFormData(stepRequest.formData, testVariables, stepVariables, environment);
                apiSpec.body = buildBody(apiSpec.body, stepRequest.body, testVariables, stepVariables, environment);

                // execute the request
                const response = await request(apiSpec, apiConfig);
                console.log(JSON.stringify(response));

                // validate the response
                const expectedInfo = stepResponse.expect;
                if (expectedInfo) {
                    const expCode = expectedInfo.code;

                    if (expCode) {
                        if (expCode === response.status) {
                            // success
                            console.log(successMessage(expCode, response.status));
                        } else {
                            // fail
                            failMessage(expCode, response.status)
                        }
                    }

                    const expMessage = expectedInfo.message;
                    if (expMessage) {
                        if (expMessage === response.statusText) {
                            // success
                            console.log(successMessage(expMessage, response.statusText));
                        } else {
                            // fail
                            failMessage(expMessage, response.statusText)
                        }
                    }
                    const expHeaders = expectedInfo.headers;
                    if (expHeaders) {
                        for (const key in expHeaders) {
                            const expectedValue = expHeaders[key];
                            const actualValue = response.headers[key];
                            if (expectedValue.value === actualValue) {
                                // success
                                console.log(successMessage(expectedValue.value, actualValue));
                            } else {
                                // fail
                                failMessage(expectedValue.value, actualValue)
                            }
                        }
                    }

                    const expects: VariableObject[] = expectedInfo.body;
                    const jsonStringify = JSON.stringify(response.body);
                    const jsonObject = JSON.parse(jsonStringify);
                    if (expects) {
                        expects.forEach((expect: VariableObject) => {
                            const key = expect.key;
                            const value = expect.value;
                            const actualValue = jsonpath.value(jsonObject, '$.' + key);
                            if (value === actualValue) {
                                // success
                                console.log(successMessage(value, actualValue));
                            } else {
                                // fail
                                console.log(failMessage(value, actualValue));
                            }
                        });
                    }

                }

                // extract values from response
                const extractInfo = stepResponse.extract;
                if (extractInfo) {
                    const extHeaders = extractInfo.headers;
                    const extBody = extractInfo.body;

                    if (extHeaders) {
                        extHeaders.forEach((exh) => {
                            const key = exh.key;
                            const varName = exh.value;
                            const varValue = response.headers[key];
                            VariableOps.push(varName, varValue, testVariables);
                        });
                    }

                    if (extBody) {
                        const jsonStringify = JSON.stringify(response.body);
                        const jsonObject = JSON.parse(jsonStringify);
                        extBody.forEach((exb) => {
                            const key = exb.key;
                            const varName = exb.value;
                            const varValue = jsonpath.value(jsonObject, '$.' + key);
                            VariableOps.push(varName, varValue, testVariables);
                            console.log(`${JSON.stringify(testVariables)}`);
                        });
                    }
                }
            } else {
                // new API that does not exist in the API spec -> first throw an error, later will execute request as is
                // TODO: implement
            }
        }
    }
}

function failMessage(expected: any, actual: any): string {
    return `FAIL - Expected: ${expected}, Actual: ${actual}`;
}

function successMessage(expected: any, actual: any): string {
    return `SUCCESS - Expected: ${expected}, Actual: ${actual}`;
}
