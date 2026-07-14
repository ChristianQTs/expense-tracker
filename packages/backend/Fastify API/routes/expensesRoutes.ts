import type { FastifyPluginAsync } from 'fastify'
import { getExpenses, addExpense, updateExpense, deleteExpense, type GetExpensesQuery } from '../controllers/expenseControllers.js'
import { POST_SCHEMA, PATCH_SCHEMA, DELETE_SCHEMA, GET_EXPENSES_SCHEMA } from '../validationSchemas.js'
import { authenticateUser } from '../preHandlers/authPreHandlers.js'
import type { AddBody, UpdateBody } from '@expense-tracker/shared'
//expenses plugin:
const expensesRoutes : FastifyPluginAsync = async(fastify, opts) => {

    fastify.addSchema(GET_EXPENSES_SCHEMA)
    fastify.addSchema(POST_SCHEMA)
    fastify.addSchema(PATCH_SCHEMA)
    fastify.addSchema(DELETE_SCHEMA)

    fastify.get<{Querystring : GetExpensesQuery}>('/', { preHandler: authenticateUser, schema: { querystring: { $ref: 'GET_EXPENSES_QUERY_SCHEMA' } } },getExpenses)
    fastify.post<{Body:AddBody}>('/', { preHandler: authenticateUser, schema: { body: { $ref: 'POST_SCHEMA#' } } }, addExpense)
    fastify.patch<{ Body: UpdateBody; Params: { expenseId: string } }>('/:expenseId', { preHandler: authenticateUser, schema: { body: { $ref: 'PATCH_SCHEMA#' } } }, updateExpense)
    fastify.delete<{ Params: { expenseId: string } }>('/:expenseId', { preHandler: authenticateUser, schema: { params: { $ref: 'DELETE_SCHEMA#' } } }, deleteExpense)
}

export {expensesRoutes }