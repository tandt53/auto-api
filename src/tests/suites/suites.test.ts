import {TestObject} from "../../testSpec/model/testObject";
import {Test} from "../../testSpec/model/test";
import {StepObject} from "../../testSpec/model/stepObject";
import {createUser} from "../apiSpec/User";

const step: StepObject = {
    name: "Test step",
    id: "test-step-id",
    description: "Test step description",
    variables: {},
    type: "test-type",
    api: createUser,
    expect: {},
    extract: {}
}
const test: Test = {
    name: "Test name",
    description: "Test description",
    id: "test-id",
    variables: {},
    steps: [step]
}

const suite: TestObject = {
    name: "Test suite",
    description: "Test suite description",
    id: "test-suite-id",
    tests: [test],
    variables: {},
    environment: "test-environment"
}

describe('Send post request', () => {

    it('should create user successfully', function () {
        const globalVariables = suite.variables;
        // update test variables if needed
        const tests = suite.tests;
        tests.forEach(test => {
            const testVariables = test.variables;
            const steps = test.steps;
            steps.forEach(step => {
                const stepVariables = step.variables;
                const api = step.api;
            });
        });


    });


});
