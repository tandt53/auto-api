import {parseSwaggerJson} from "../../parser/v2/parser";

describe('Parser PetStore Swagger', () => {
    it('should parse successfully', async function () {
        const apiSpecs = await parseSwaggerJson('openapi.json');
        console.log(JSON.stringify(apiSpecs, null, 2));
    });
});
