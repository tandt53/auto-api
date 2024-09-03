const payload = {
    "id": 10,
    "username": "theUser",
    "firstName": "John",
    "lastName": "James",
    "email": "john@email.com",
    "password": "12345",
    "phone": "12345",
    "userStatus": 1
}

function generateTestCases(payload: object) {
    const keys = Object.keys(payload);
    for (let i = 0; i < keys.length; i++) {
        const value = payload[keys[i]];
        console.log(typeof value);
    }
    // getting all type of values
    const values = Object.values(payload);
    const testCases = [];
    // generating test cases
    for (let i = 0; i < keys.length; i++) {
        const testCase = {};
        testCase[keys[i]] = values[i];
        testCases.push(testCase);
    }
    return testCases;
}

describe('Generate test cases', function () {
    it('should generate test cases', function () {
        const testCases = generateTestCases(payload);
        console.log(testCases);
    });
})


type NumberRange = {
    min?: number,
    max?: number
}

// if within exists, then choose 1 of values
// if range exists, the choose values: min, max, min-1, max+1
// if range exists, choose values: range.min, range.max, range.min-1, range.max-1
// if min & max exist, chose
type NumberRule = {
    range?: NumberRange,
    multipleRange?: NumberRange[],
    within: number[]
}
// generate data for number type

export const generateNumbers = (rule: NumberRule) => {
    const numbers = [];
    const {range, multipleRange, within} = rule;

    if (range) {
        numbers.push(generateNumberRange(range));
    } else if (multipleRange) {
        for (let i = 0; i < multipleRange.length; i++) {
            numbers.push(multipleRange[i]);
        }
    } else if(within){
        // random choose 1 values
        numbers.push(within[0]); // TODO: update index
    } else {
        numbers.push(100) // TODO: update random number
    }

    return numbers;
}
const generateNumberRange = (range: NumberRange): number[] => {
    const MIN_INT = -1000; // TODO: update this number
    const MAX_INT = 1000; // TODO: update this number

    const values = [];
    const {min, max} = range;
    if (min && max) {
        values.push(min);
        values.push(min - 1);
        values.push(max);
        values.push(max + 1);
    } else if (min) {
        values.push(min);
        values.push(min - 1);
        values.push(MAX_INT);
        values.push(MAX_INT + 1)
    } else if (max) {
        values.push(MIN_INT);
        values.push(MIN_INT - 1)
        values.push(max);
        values.push(max + 1)
    }
    return values;
}
