import {specParser} from "./parser/specParser";
import {request} from "./httpclient/request";
import {ApiConfig} from "./httpclient/ApiConfig";


async function main(){
    const apiRequestOptions = await specParser('openapi.json');
    const path = '/user';
    const method = 'POST';

    const apiRequestOption = apiRequestOptions.find(apiRequestOption => apiRequestOption.path === path && apiRequestOption.method === method);
    const apiConfig: ApiConfig = {
        baseUrl: 'https://petstore3.swagger.io/api/v3/',
    }
    const response = await request(apiRequestOption, apiConfig);
    console.log(JSON.stringify(response));

}
main()




