import {VariableObject} from "@testSpec/model/variableObject";

const REGEX_VARIABLE = /\${(\w+)}/g;

export class VariableOps {

    static isContainsVariable(str: string): boolean {
        return REGEX_VARIABLE.test(str);
    }

    static getValue(str: string, testVars: VariableObject[], stepVars: VariableObject[]) {
        const REGEX_VARIABLE = /\${(\w+)}/g;
        while (REGEX_VARIABLE.test(str)) {
            str = str.replaceAll(REGEX_VARIABLE, (match, p1) => {
                const replacement = stepVars.find(stepVar => stepVar.key === p1)?.value || testVars.find(testVar => testVar.key === p1)?.value;
                if (replacement) {
                    return `${replacement}`;
                }
                throw new Error(`Variable ${p1} not found`);
            });
        }
        return str;
    }
}
