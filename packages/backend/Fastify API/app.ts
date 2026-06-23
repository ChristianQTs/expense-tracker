import 'dotenv/config'
import Fastify from 'fastify'
import type { FastifyError } from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastifyRateLimit from '@fastify/rate-limit'
import {Redis} from 'ioredis' 
import { expensesRoutes } from './routes/expensesRoutes.js'
import { budgetRoutes } from './routes/budgetRoutes.js'
import { authRoutes } from './routes/authRoutes.js'

const redisRateLimiting = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: null,
    connectTimeout: 5000
})

const port : number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8001
const app = Fastify({ logger: false, trustProxy:true })
await app.register(cookie, { secret: process.env.JWT_SECRET })
await app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: 60000,
    redis: redisRateLimiting,
    errorResponseBuilder: (request, context) => ({ statusCode: 429, error: 'Too many request', message:`Too much expense tracking, try again in ${context.after}`})
})
await app.register(cors, {
    origin: (origin, cb) => {
        // Allow local development or requests with no origin (like mobile apps/Postman)
        if (!origin || origin.startsWith('http://localhost:')) {
            cb(null, true)
            return
        }

        const hostname = new URL(origin).hostname

        // Check if the domain is production URL OR a dynamic Vercel sub-domain
        if (
            hostname === 'expense-tracker-qt.vercel.app' ||
            hostname.endsWith('.vercel.app')
        ) {
            cb(null, true)
            return
        }

        // Block anything else
        cb(new Error("Not allowed by CORS"), false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],

})
//register plugins
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