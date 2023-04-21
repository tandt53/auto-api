import {TestObject} from "@testSpec/model/testObject";

/**
 * this method will parse the test.yml to get the test spec
 *
 * @param testDesign the test design file (.yml)
 * @returns TestObject[] an array of test specs
 */
export function testParser(testDesign: string): Promise<TestObject[]> {
    throw new Error("Not implemented");
}
