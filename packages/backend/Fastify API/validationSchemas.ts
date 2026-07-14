//GET EXPENSES REQUEST SCHEMA:
export const GET_EXPENSES_SCHEMA = {
    $id: 'GET_EXPENSES_QUERY_SCHEMA',
    type: 'object',
    properties: {
        start: { type: 'string', description: 'The start window date-time string'},
        end: { type: 'string', description: 'The end window date-time string' }
    },
    additionalProperties : false
}

//POST REQUESTS SCHEMA:
export const POST_SCHEMA = {
    $id: 'POST_SCHEMA',
    type: "object",
    properties: {
        name: { type: 'string', minLength: 1, pattern: '^(?=.*[a-zA-Z]).+$' },
        amount: { type: 'number', minimum: 1 },
        category: { type: 'string', minLength: 1, pattern: '^(?=.*[a-zA-Z]).+$' }
    },
    required: ['name', 'amount', 'category']
}
//PATCH REQUESTS SCHEMA:
export const PATCH_SCHEMA = {
    $id: 'PATCH_SCHEMA',
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, pattern: '^(?=.*[a-zA-Z]).+$' },
        amount: { type: 'number', minimum: 1 },
        category: { type: 'string', minLength: 1, pattern: '^(?=.*[a-zA-Z]).+$' }
    },
    minProperties: 1,
    additionalProperties : false
}
//DELETE REQUESTS SCHEMA:
export const DELETE_SCHEMA = {
    $id: 'DELETE_SCHEMA',
    type: 'object',
    properties: {
        expenseId: { type: 'string', pattern: '^[0-9]+$' }
    },
    required: ['expenseId']
}
//SET BUDGET PATCH BODY SCHEMA:
export const BUDGET_PATCH_BODY_SCHEMA = {
    $id: 'BUDGET_SET_BODY_SCHEMA',
    type: 'object',
    properties: {
        budget: { type: 'number', minimum: 1 },
    },
    required : ['budget']
}
//SET BUDGET PATCH QUERY STRING SCHEMA:
export const BUDGET_PATCH_QUERY_SCHEMA = {
    $id: 'BUDGET_SET_QUERY_SCHEMA',
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum : ['monthly', 'quarterly', 'yearly']
        }
    },
    required : ['type']
}
//LOGIN POST SCHEMA:
export const LOGIN_SCHEMA = {
    $id: 'LOGIN_SCHEMA',
    type: 'object',
    properties: {
        username: { type: 'string', minLength: 1 },
        password: {type : 'string', minLength : 1}
    },
    required : ['username', 'password']
}
//REGISTER_SCHEMA
export const REGISTER_SCHEMA = {
    $id: 'REGISTER_SCHEMA',
    type : 'object',
    properties: {
        username: { type: 'string', minLength: 4 },
        password: { type: 'string', minLength: 5 }
    },
    required: ['username', 'password']
}