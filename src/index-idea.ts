
import {getApiSpec} from "./parser/parser";
import {getTestSpec} from "./tests/testDesign";
import {buildTestSuite} from "./tests/suite";

const swaggerJson = "openapi.json";
const testJson = "api-test.json";

const allWorks = async () => {
    // get all arguments and setup configuration

    // parse the API specification
    const apiSpecs = await getApiSpec(swaggerJson);
    console.log(apiSpecs);

    // parse the API test design
    const testSpecs = await getTestSpec(testJson);
    console.log(testSpecs);

    // build the whole test suite
    // sometimes need to load hooks: setup and teardown suite/test/request
    const testSuite = await buildTestSuite(apiSpecs, testSpecs);

    // execute test suite

    // generate report

}

allWorks();
