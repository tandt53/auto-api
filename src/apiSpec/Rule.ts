// fields are selected from
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#schemaObject
export interface Rule {
    type: string;
    properties?: Record<string, Rule>;
    items?: Rule;
    required?: string[];
    enum?: unknown[];
    minItems?: number;
    maxItems?: number;
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    format?: string;
}
