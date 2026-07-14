import type { FastifyPluginAsync } from 'fastify'
import { setBudget, deleteBudget } from '../controllers/budgetControllers.js'
import { BUDGET_PATCH_BODY_SCHEMA, BUDGET_PATCH_QUERY_SCHEMA } from '../validationSchemas.js'
import { authenticateUser } from '../preHandlers/authPreHandlers.js'
//budget plugin

const budgetRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.addSchema(BUDGET_PATCH_BODY_SCHEMA)
    fastify.addSchema(BUDGET_PATCH_QUERY_SCHEMA)
    fastify.addHook('preHandler', authenticateUser)

    fastify.patch('/set', { schema: { body: { $ref: 'BUDGET_SET_BODY_SCHEMA' }, querystring: { $ref: 'BUDGET_SET_QUERY_SCHEMA'} } }, setBudget)
    fastify.patch('/delete', { schema: { querystring: { $ref: 'BUDGET_SET_QUERY_SCHEMA' } }} ,deleteBudget)
}

export {budgetRoutes }