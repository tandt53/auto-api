import { ApiSpec } from "../../src/apiSpec/ApiSpec";

export const user = '/user';

export const createUser: ApiSpec = {
    method: "POST",
    operationId: "createUser",
    path: "/user",
    body: {
        user: {
            id: 10,
            username: "theUser",
            password: "12345",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@gmail.com",
            phone: "123456789",
            userStatus: 1
        }
    },
    mediaType: "application/json"
}


export const createUserWithFormEncodedUrl: ApiSpec = {
    method: "POST",
    operationId: "createUserWithFormEncodedUrl",
    path: "/user",
    body: {
        user: {
            id: 10,
            username: "theUser",
            password: "12345",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@gmail.com",
            phone: "123456789",
            userStatus: 1
        }
    },
    mediaType: "application/x-www-form-urlencoded"
}

export const createUserWithXml: ApiSpec = {
    method: "POST",
    operationId: "createUserWithFormEncodedUrl",
    path: "/user",
    body: {
        user: {
            id: 10,
            username: "theUser",
            password: "12345",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@gmail.com",
            phone: "123456789",
            userStatus: 1
        }
    },
    mediaType: "application/xml"
}
