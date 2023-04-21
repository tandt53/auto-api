import {expect} from "chai";

describe('Send post request', () => {
    it('should create user successfully', async function () {
        const axios = require('axios');
        const data = {
            "id": 10,
            "username": "theUser",
            "firstName": "John",
            "lastName": "James",
            "email": "john@email.com",
            "password": "12345",
            "phone": "12345",
            "userStatus": 1
        }

        const response = await axios.post('https://petstore3.swagger.io/api/v3/user', data);
        console.log(JSON.stringify(response.data, null, 2));
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('id');
        expect(response.data).to.have.property('username');
        expect(response.data).to.have.property('firstName');
        expect(response.data).to.have.property('lastName');
        expect(response.data).to.have.property('email');
        expect(response.data).to.have.property('password');
        expect(response.data).to.have.property('phone');
        expect(response.data).to.have.property('userStatus');

        expect(response.data.id).to.equal(data.id);
        expect(response.data.username).to.equal(data.username);
        expect(response.data.firstName).to.equal(data.firstName);
        expect(response.data.lastName).to.equal(data.lastName);
        expect(response.data.email).to.equal(data.email);
        expect(response.data.password).to.equal(data.password);
        expect(response.data.phone).to.equal(data.phone);
        expect(response.data.userStatus).to.equal(data.userStatus);
    });
});
