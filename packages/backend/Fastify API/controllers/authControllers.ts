import type { FastifyRequest, FastifyReply } from 'fastify'
import type { AuthBody } from '../../types/authTypes.js'
import type { users } from '@prisma/client'
import prisma from '../../prisma/prismaClient.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const JWT_KEY : string = String(process.env.JWT_SECRET)

//login

export async function login(request: FastifyRequest<{Body : AuthBody}>, reply : FastifyReply) {

    try {

        const { username, password } = request.body

        const user = await prisma.users.findUnique({ where: { username }, select: { id: true, username: true, hashed_password : true, budget : true } })

        if (!user) return reply.code(401).send({  message: 'Invalid credentials' })

        const passwordMatch = await bcrypt.compare(password, user.hashed_password)

        if (!passwordMatch) return reply.code(401).send({ message: 'Invalid credentials' })

        const token = jwt.sign({ id: user.id }, JWT_KEY, { expiresIn: '1h' })
        reply.setCookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            partitioned: true,
            maxAge : 1800
        })

        return { user: {id : user.id, username : user.username, budget : user.budget} }
    } catch (err) {

        console.error('Login error: ', err)
        reply.code(500).send({ message: 'Internal Server Error' })

    }
}

//register

export async function register(request: FastifyRequest<{Body : AuthBody}>, reply : FastifyReply) {

    try {
        const { username, password } = request.body

        const alreadyUser = await prisma.users.findUnique({ where: { username } })

        if (alreadyUser) return reply.code(409).send({ message: 'Username not available' })

        const hashed_password = await bcrypt.hash(password, 10)

        const newUser : users = await prisma.users.create({
            data: {
                username,
                hashed_password 
            }
        })

        return {id : newUser.id, username : newUser.username}
    } catch (err) {

        console.error(err)
        return reply.code(500).send({ message: 'Internal Server Error' })

    }
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
    try {
        return reply.setCookie('token', '', {
            path: '/',
            secure: false,
            sameSite: 'lax',
            expires: new Date(0),
            httpOnly: true
        }).send({ message: 'Logged out successfully.' })
    }
    catch (err: any) {
        reply.code(500).send(err.message || 'Internal Server Error')
    }
}