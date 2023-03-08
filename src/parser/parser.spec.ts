/**
 * generate all unit tests for @link{./parser.ts/getApiSpec}
 * - valid input file name (openapi.json) and return an array of Api
 * - invalid input file name (openapi.json) and return an error
 * - invalid json format and return an error
 * - valid json format but not a valid openapi spec and return an error
 */

import {getApiSpec} from "./parser";
import {expect} from "chai";

describe("getApiSpec", () => {

    it("should return an array of Api", async () => {
        const apis = await getApiSpec("openapi.json");
        expect(apis).to.be.instanceof(Array);
        expect(apis[0]).to.be.instanceof(Object);
        expect(apis[0]).to.have.property("path");
        expect(apis[0]).to.have.property("method");
        expect(apis[0]).to.have.property("operationId");
        expect(apis[0]).to.have.property("requestBody");
        expect(apis[0]).to.have.property("parameters");
        expect(apis[0]).to.have.property("responses");
        expect(apis[0]).to.have.property("security");
        expect(apis[0]).to.have.property("description");
        expect(apis[0]).to.have.property("summary");
        expect(apis[0]).to.have.property("tags");
        expect(apis[0]).to.have.property("deprecated");
        expect(apis[0]).to.have.property("servers");
    });

    it("should return an error", async () => {
        try {
            await getApiSpec("invalid-openapi.json");
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it("should return an error", async () => {
        try {
            await getApiSpec("testData/parser/validJson.json");
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    })

    it("should return an error", async () => {
        try {
            await getApiSpec("testData/parser/invalidFormat.json");
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    })

});
