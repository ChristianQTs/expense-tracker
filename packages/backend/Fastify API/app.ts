
import Fastify from 'fastify'
import type { FastifyError } from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import { expensesRoutes } from './expensesRoutes.js'
import { budgetRoutes } from './budgetRoutes.js'
import { authRoutes } from './authRoutes.js'
import 'dotenv/config'
const port : number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8001
const app = Fastify({ logger: false })
await app.register(cors, { origin: 'https://expense-tracker-frontend-chriqt.vercel.app', credentials : true, methods: ['GET', 'POST', 'PATCH', 'DELETE'] })
await app.register(cookie)
//register expenses plugin
app.register(expensesRoutes, { prefix: '/users/expenses' })
app.register(budgetRoutes, { prefix: '/users/budget' })
app.register(authRoutes, { prefix: '/users/auth' })
app.decorateRequest('user', undefined)
//handle errors
app.setErrorHandler(async (err:FastifyError, request, reply) => {

    request.log.error(err)
    if (err.validation) {
        reply.code(400)
        return {
            error: 'Validation error',
            message: err.message,
            details: err.validation
        }
    }
    return reply.code(err.statusCode || 500).send({
        message : err.message
    })
})
await app.listen({ port, host : '0.0.0.0' }, function (err) {
    if (err) {
        return app.log.error(err)
    }
    console.log(`Fastify API started, server listening on port ${port}`)
})