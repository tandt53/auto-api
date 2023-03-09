import {getApiSpec} from "./parser/parser";
import {getTestSpec} from "./tests/testDesign";
import {buildTestSuite} from "./tests/suite";
import {Api} from "./parser/api";
import {OpenAPIV3} from "openapi-types";

const swaggerJson = "openapi.json";
const testJson = "api-test.json";

const allWorks = async () => {
    const apis: Api[] = await getApiSpec(swaggerJson);
    const api = apis[0];
    // parse all the properties of api
    const path = api.path;
    const method = api.method;
    const operationId = api.operationId;
    const requestBody = api.requestBody;
    const parameters = api.parameters;
    const responses = api.responses;
    const security = api.security;
    const description = api.description;
    const summary = api.summary;
    const tags = api.tags;
    const deprecated = api.deprecated;
    const servers = api.servers;

    // parse the request body
    if (requestBody) {
        parseRequestBody(requestBody);
    }

}

function parseRequestBody(body: OpenAPIV3.RequestBodyObject) {
    // parse the body
    const description = body.description;
    const required = body.required;
    const content = body.content;
    // parse all content
    for (const key in content) {
        const mediaType = content[key];
        const schema = mediaType.schema;
        const examples = mediaType.examples;
        const example = mediaType.example;
        const encoding = mediaType.encoding;

    }

}

allWorks();
