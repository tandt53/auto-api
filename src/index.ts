import {getApiSpec} from "./parser/parser";
import {getTestSpec} from "./tests/testDesign";
import {buildTestSuite} from "./tests/suite";
import {Api} from "./parser/api";
import {OpenAPIV3} from "openapi-types";
import parser from '@apidevtools/swagger-parser';
import {getApiSpec2} from "./parser/parser2";

const swaggerJson = "openapi.json";
const testJson = "api-test.json";

const allWorks = async () => {
    const apis: Api[] = await getApiSpec2(swaggerJson);

}

allWorks();
