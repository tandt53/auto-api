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
