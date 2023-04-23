import * as yaml from 'js-yaml';
import * as fs from 'fs';


/**
 * this method will parse the test.yml to get the test spec
 *
 * @param testDesign the test design file (.yml)
 * @returns TestObject[] an array of test specs
 */
export function testParser(testDesign: string): any {
    const fileContent = fs.readFileSync(testDesign, 'utf8');
    return yaml.load(fileContent);
}
