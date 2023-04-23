import {VariableObject} from "@testSpec/model/variableObject";


export class VariableOps {

    static isContainsVariable(str: string): boolean {
        const REGEX_VARIABLE = /\${(\w+)}/g;
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

    static push(key: string, actualValue: any, testVariables: VariableObject[]) {
        const variable = testVariables.find(variable => variable.key === key);
        if (variable) {
            variable.value = actualValue;
        } else {
            testVariables.push({key, value: actualValue});
        }
    }
}
