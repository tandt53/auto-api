import {specParser} from "@parser/specParser";
import {request} from "@httpclient/request";
import {ApiConfig} from "@httpclient/ApiConfig";
import {testParser} from "@parser/testParser";
import {execute} from "@execution/execution";
import {TestObject} from "@testSpec/model/testObject";
import {VariableObject} from "@testSpec/model/variableObject";


async function main() {
    const apiRequestOptions = await specParser('openapi.json');
    const path = '/user';
    const method = 'POST';

    const apiConfig: ApiConfig = {
        baseUrl: 'https://petstore3.swagger.io/api/v3',
    }
    // const apiRequestOption = apiRequestOptions.find(apiRequestOption => apiRequestOption.path === path && apiRequestOption.method === method);
    // const response = await request(apiRequestOption, apiConfig);
    // console.log(JSON.stringify(response));


    // parse test
    const yamlFile = 'data/post-user.yaml';
    const testObject: TestObject = testParser(yamlFile);
    // console.log(JSON.stringify(testObject));

    // execute
    await execute([testObject], apiRequestOptions, apiConfig)


}

main()




