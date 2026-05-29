
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
await app.register(cors, {
    origin: (origin, cb) => {
        // Allow local development or requests with no origin (like mobile apps/Postman)
        if (!origin || origin.startsWith('http://localhost:')) {
            cb(null, true)
            return
        }

        const hostname = new URL(origin).hostname

        // Check if the domain is your production URL OR a dynamic Vercel sub-domain
        if (
            hostname === 'expense-tracker-qt.vercel.app' ||
            hostname.endsWith('.vercel.app')
        ) {
            cb(null, true)
            return
        }

        // Block anything else
        cb(new Error("Not allowed by CORS"), false)
    }, credentials : true, methods: ['GET', 'POST', 'PATCH', 'DELETE'] })
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