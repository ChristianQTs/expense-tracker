import type { FastifyRequest, FastifyReply } from 'fastify'
import { cookieConfig } from '../controllers/authControllers.js'
import { redisClient } from '../../redis/redisClient.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const JWT_SECRET: string = String(process.env.JWT_SECRET)


interface TokenPayload {
    id:number
}
export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {

    const token = request.cookies.token

    try {
        const decoded = jwt.verify(token!, JWT_SECRET) as unknown as TokenPayload
        request.user = decoded
    } catch (err) {
        const currentRefreshToken = request.cookies.refreshToken
        if (!currentRefreshToken) {
            return reply.code(401).send({ message: 'Unauthorized' })
        }
    }
}

export async function authenticateUserRefresh(request: FastifyRequest, reply: FastifyReply) {
    let token = request.cookies.token

    if (!token) {
        const currentRefreshToken = request.cookies.refreshToken
        if (!currentRefreshToken) return reply.code(401).send({ message: 'Unauthorized, missing refresh token' })

        try {
            const redisKey = `session:${currentRefreshToken}`
            const user_id = await redisClient.get(redisKey)
            if (!user_id) {
                return reply.code(401).send({ message: 'Invalid refresh token' })
            }
            request.user = { id: Number(user_id) } as any
            return;
        } catch (err) {
            console.error('Session refresh middleware failure:', err)
            return reply.code(401).send({ message: ' Unauthorized, failed to verify refresh token' })
        }
    }
    try {
        const decoded = jwt.verify(token!, JWT_SECRET) as unknown as TokenPayload
        request.user = decoded
    } catch (err) {
        return reply.code(401).send({ message: 'Unauthorized, invalid access token' })
    }
}
