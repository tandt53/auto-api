import {VariableObject} from "./variableObject";

/**
 * validate the response of the request
 */
export interface ExpectObject {
    code?: number,
    message?: string
    headers?: VariableObject[],
    body?: VariableObject[],
}

//TODO follow the guide below to create and test validation methods
/**
 * validate the response of the request
 * name: the name of the header
 * value: the expected value of the header.
 * - value can be a regex, e.g. "value": "^[0-9]{3}$"
 * - value can be a string, e.g. "value": "application/json"
 * - value can be a number, e.g. "value": 123
 * - value can be a boolean, e.g. "value": true
 * - value can be an array, e.g. "value": [1,2,3]
 * - value can be an object, e.g. "value": {"a": 1, "b": 2} -> this is not recommended, because the order of the keys is not guaranteed
 * - value can be null, e.g. "value": null
 * - value can be undefined, e.g. "value": undefined
 * - value can be a function, e.g. "value": function(value) { return value === "application/json" }
 */
