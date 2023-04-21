/**
 * Variable object includes
 * key: string
 * value: string | number | boolean | null | undefined | Array<any>
 *  Where  string could
 * - be exact value: ‘abc’
 * - include another variable: '${id}' , '${id} ${username}'
 * - include function: fn_name(param1, param2)
 */
export interface VariableObject {
    key: string,
    value: string | number | boolean | null | undefined | Array<any>
}
