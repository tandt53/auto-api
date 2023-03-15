import {JSONSchemaFaker} from 'json-schema-faker';
import OpenAPIParser from "@apidevtools/swagger-parser";

// Define the endpoint and method to generate a request body for
const endpoint = '/pet/{petId}/uploadImage';
const method = 'post';

// Define a function that fetches the Swagger or OpenAPI specification
async function fetchSpec(): Promise<any> {
    // const response = await axios.get('https://petstore3.swagger.io/api/v3/openapi.json');
    const parser = new OpenAPIParser();
    return await parser.dereference('openapi.json');
}

// Define a function that generates a random request body based on the schema
async function generateRequestBody(spec: any, endpoint: string, method: string): Promise<any> {
    // Find the schema for the request body in the Swagger or OpenAPI specification
    const path = spec.paths[endpoint];
    if (!path) {
        console.error(`Error: Could not find path ${endpoint} in specification`);
        return undefined;
    }

    const operation = path[method];
    if (!operation) {
        console.error(`Error: Could not find ${method} operation for path ${endpoint} in specification`);
        return undefined;
    }

    const requestBodySchema = operation.requestBody?.content['application/json']?.schema;
    if (!requestBodySchema) {
        console.error(`Error: Could not find request body schema for ${method} operation on path ${endpoint} in specification`);
        return undefined;
    }

    // Use json-schema-faker to generate a random object that matches the request body schema
    const requestBody = await JSONSchemaFaker.resolve(requestBodySchema);

    return requestBody;
}

// Example usage:
async function main() {
    // Fetch the Swagger or OpenAPI specification
    const spec = await fetchSpec();

    // Generate a random request body that matches the schema
    const requestBody = await generateRequestBody(spec, endpoint, method);
    if (!requestBody) {
        console.error('Error: Failed to generate request body');
        return;
    }

    // Log the generated request body
    console.log(requestBody);
}

main();
