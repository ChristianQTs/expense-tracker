import type { FastifyPluginAsync } from 'fastify'
import { login, register,logout, getMe } from '../controllers/authControllers.js'
import { LOGIN_SCHEMA, REGISTER_SCHEMA} from '../validationSchemas.js'
import { authenticateUserRefresh } from '../preHandlers/authPreHandlers.js'
const authRoutes : FastifyPluginAsync = async (fastify, opts) => {

    fastify.addSchema(LOGIN_SCHEMA)
    fastify.addSchema(REGISTER_SCHEMA)
    
    fastify.post('/login', { schema: { body: { $ref: 'LOGIN_SCHEMA' } } }, login)
    fastify.post('/register', { schema: { body: { $ref: 'REGISTER_SCHEMA' } } }, register)
    fastify.post('/logout', logout)
    fastify.get('/me', { preHandler: authenticateUserRefresh } ,getMe)
}

export {authRoutes }