import type { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const JWT_SECRET : string = String(process.env.JWT_SECRET)
export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {

    const token = request.cookies.token

    if (!token) return reply.code(401).send({ message: 'Missing token' })

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id : number}
        request.user = decoded
    } catch (err) {
        console.error(err)
        return reply.code(401).send({message : 'Invalid token'})
    }   
}