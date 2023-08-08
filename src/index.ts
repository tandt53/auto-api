import {specParser} from "@parser/specParser";
import {ApiConfig} from "@httpclient/ApiConfig";
import {testParser} from "@parser/testParser";
import {execute} from "@execution/execution";
import {TestObject} from "@testSpec/model/testObject";

async function main() {
    const apiRequestOptions = await specParser('openapi.json');

    const apiConfig: ApiConfig = {
        baseUrl: 'https://petstore3.swagger.io/api/v3',
    }

    // parse test
    const yamlFile = 'data/post-user.yaml';
    const testObject: TestObject = testParser(yamlFile);
    // console.log(JSON.stringify(testObject));

    // execute
    await execute([testObject], apiRequestOptions, apiConfig);

}

main()




