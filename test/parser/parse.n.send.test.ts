import {expect} from "chai";
import {ApiConfig} from "../../src/httpclient/ApiConfig";
import {ApiSpec} from "../../src/apiSpec/ApiSpec";
import {request} from "../../src/httpclient/request";
import {specParser} from "../../src/parser/specParser";

describe('POST /user', async () => {
    const method = 'POST';
    const path = '/user';
    const config: ApiConfig = {
        baseUrl: "https://petstore3.swagger.io/api/v3"
    }
    it('should parse and send request successfully', async function () {
        const apiSpecs: ApiSpec[] = await specParser('openapi.json');
        // console.log(JSON.stringify(apiSpecs, null, 2));
        const spec = apiSpecs.find((apiSpec) => apiSpec.method === method && apiSpec.path === path);
        console.log(JSON.stringify(spec, null, 2));
        console.log('=========================================');

        const response = await request(spec, config);
        console.log(JSON.stringify(response, null, 2));
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('username');
        expect(response.body).to.have.property('firstName');
        expect(response.body).to.have.property('lastName');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('password');
        expect(response.body).to.have.property('phone');
        expect(response.body).to.have.property('userStatus');
    });
})
