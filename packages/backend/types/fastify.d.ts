import { PrismaClient } from '@prisma/client'
import type { SignOptions } from 'jsonwebtoken'
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient
        customGenerateToken : (payload : object) => string
    }
    interface FastifyRequest {
        user?: {
            id : number
        }
    }
}