import type { FastifyPluginAsync } from 'fastify'
import { login, register } from './controllers/authControllers.js'
import { LOGIN_SCHEMA, REGISTER_SCHEMA} from './validationSchemas.js'

const authRoutes : FastifyPluginAsync = async (fastify, opts) => {

    fastify.addSchema(LOGIN_SCHEMA)
    fastify.addSchema(REGISTER_SCHEMA)
    
    fastify.post('/login', { schema: { body: { $ref: 'LOGIN_SCHEMA' } } }, login)
    fastify.post('/register', { schema: { body: { $ref: 'REGISTER_SCHEMA' } } }, register)
}

export {authRoutes }