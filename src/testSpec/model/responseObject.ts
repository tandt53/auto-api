import {ExpectObject} from "./expectObject";
import {ExtractObject} from "./extractObject";

export interface ResponseObject {
    expect: ExpectObject;
    extract: ExtractObject;
}
