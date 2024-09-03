// import {specParser} from "@parser/specParser";
import {specParser} from "../../src/parser/specParser";

describe('Parser PetStore Swagger', () => {
    it('should parse successfully', async function () {
        const apiSpecs = await specParser('openapi.json');
        console.log(JSON.stringify(apiSpecs, null, 2));
    });
});
