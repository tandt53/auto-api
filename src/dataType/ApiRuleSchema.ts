
export interface ApiRuleSchema {
    type: 'object';
    url: string;
    method: string;
    operationId: string;
    path?: {
        type: 'object',
        properties: {  }
    },
    cookies?: {
        type: 'object',
        properties: {}
    },
    headers?: {
        type: 'object',
        properties: {}
    },
    query?: {
        type: 'object',
        properties: {}
    },
    formData?: {
        type: 'object',
        properties: {}
    },
    body?: {
        type: 'object',
        properties: {}
    }
    mediaType?: string;

}
