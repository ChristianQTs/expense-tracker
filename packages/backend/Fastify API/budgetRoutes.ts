import type { FastifyPluginAsync } from 'fastify'
import { setBudget, deleteBudget } from './controllers/budgetControllers.js'
import { BUDGET_PATCH_SCHEMA } from './validationSchemas.js'
import { authenticateUser } from './preHandlers/authPreHandlers.js'
//budget plugin

const budgetRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.addSchema(BUDGET_PATCH_SCHEMA)
    fastify.addHook('preHandler', authenticateUser)

    fastify.patch('/set', { schema: { body: { $ref: 'BUDGET_SET_SCHEMA' } } }, setBudget)
    fastify.patch('/delete', deleteBudget)
}

export {budgetRoutes }