import {ApiSpec, request} from "../../../httpclient";
import {ApiConfig} from "../../../httpclient/ApiConfig";
import {createUser, createUserWithFormEncodedUrl, createUserWithXml} from "../../apiSpec/User";
import {expect} from "chai";

const defaultConfig: ApiConfig = {
    baseUrl: "https://petstore3.swagger.io/api/v3"
}

describe('POST /user', () => {
    it('should be able to create a new user with application/json', async () => {
        await createUserAndVerify(createUser, defaultConfig)
    });

    it('should be able to create a new user with form encoded url', async () => {
        await createUserAndVerify(createUserWithFormEncodedUrl, defaultConfig);
    });

    it('should be able to create a new user with application/xml', async () => {
        await createUserAndVerify(createUserWithXml, defaultConfig);
    })

    //TODO
    // it('should send request with octet-stream', function () {
    //
    // });

    async function createUserAndVerify(spec: ApiSpec, config: ApiConfig) {
        const response = await request(spec, config);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('username');
        expect(response.body).to.have.property('firstName');
        expect(response.body).to.have.property('lastName');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('password');
        expect(response.body).to.have.property('phone');
        expect(response.body).to.have.property('userStatus');
    }
});


