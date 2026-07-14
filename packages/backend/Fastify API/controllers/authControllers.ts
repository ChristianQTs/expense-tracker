import type { FastifyRequest, FastifyReply } from 'fastify'
import {redisClient} from '../../redis/redisClient.js'
import type { AuthBody } from '../../types/authTypes.js'
import type { users } from '@prisma/client'
import prisma from '../../prisma/prismaClient.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'node:crypto'
import 'dotenv/config'
import { CookieSerializeOptions } from '@fastify/cookie'

const JWT_KEY: string = String(process.env.JWT_SECRET)
const IS_PROD = process.env.NODE_ENV === 'production'
//Token Cookie configs
export const cookieConfig: CookieSerializeOptions = {
    path: '/',
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? 'none' : 'lax'
}
//login

export async function login(request: FastifyRequest<{Body : AuthBody}>, reply : FastifyReply) {

    try {

        const { username, password } = request.body

        const user = await prisma.users.findUnique({ where: { username }, select: { id: true, username: true, hashed_password : true, monthly_budget : true, quarterly_budget:true, yearly_budget:true } })

        if (!user) return reply.code(401).send({  message: 'Invalid credentials' })

        const passwordMatch = await bcrypt.compare(password, user.hashed_password)

        if (!passwordMatch) return reply.code(401).send({ message: 'Invalid credentials' })
        //Generate the refreshToken
        const refreshToken = randomBytes(40).toString('hex')
        const redisKey = `session:${refreshToken}`
        const sevenDaysInSeconds = 7 * 24 * 60 * 60
        //Save refreshToken in Redis with 7 day expiration
        await redisClient.set(redisKey, user.id, { EX: sevenDaysInSeconds })
        //Generate Access Token
        const token = jwt.sign({ id: user.id }, JWT_KEY, { expiresIn: '15m' })
        //Send Refresh Token in Cookie
        reply.setCookie('refreshToken', refreshToken, {
            ...cookieConfig,
            maxAge: sevenDaysInSeconds        
        })
        //Send Access Token in Cookie
        reply.setCookie('token', token, {
            ...cookieConfig,
            maxAge: 900
        })
        
        return { user: { id: user.id, username: user.username, monthlyBudget: user.monthly_budget, quarterlyBudget : user.quarterly_budget, yearlyBudget : user.yearly_budget } }
        
    } catch (err) {

        console.error('Login error: ', err)
        reply.code(500).send({ message: 'Internal Server Error' })

    }
}

//register

export async function register(request: FastifyRequest<{Body : AuthBody}>, reply : FastifyReply) {

    try {
        const { username, password } = request.body

        const hashed_password = await bcrypt.hash(password, 10)

        const newUser : users = await prisma.users.create({
            data: {
                username,
                hashed_password 
            }
        })

        return {id : newUser.id, username : newUser.username}
    } catch (err: any) {
        console.error(err)
        if (err.code === 'P2002') return reply.code(409).send({ message: 'Username not available' })
        return reply.code(500).send({ message: 'Internal Server Error' })

    }
}

//logout
export async function logout(request: FastifyRequest, reply: FastifyReply) {
    try {

        const token = request.cookies.token
        const refreshToken = request.cookies.refreshToken
        let user_id: string | null = null

        if (token) {
            const decoded = jwt.decode(token) as { id: string } | null
            if(decoded?.id) user_id = decoded.id
        }
        //Delete refresh token if access token was not expired
        if (user_id) {
            await redisClient.del(`session:${refreshToken}`)
        }
        reply.setCookie('token', '', {
            ...cookieConfig,
            expires: new Date(0)
         })
        reply.setCookie('refreshToken', '', {
            ...cookieConfig,
            expires:new Date(0)
        })

        return {message : 'Logged out successfully'}
    }
    catch (err: any) {
        reply.code(500).send(err.message || 'Internal Server Error')
    }
}

//me
export async function getMe(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = await prisma.users.findUnique({
            where: { id: request.user!.id },
            select: {id:true, username:true, monthly_budget:true, quarterly_budget:true, yearly_budget: true}
        })

        if (!user) return reply.code(401).send({ message: 'Invalid credentials' })

        const newAccessToken = jwt.sign({ id: request.user!.id }, JWT_KEY, { expiresIn: '15m' })
        reply.setCookie('token', newAccessToken, {
            ...cookieConfig,
            maxAge: 900
        })
        return user
    } catch (err) {
        return reply.code(500).send({ message: 'Internal Server Error' })
    }
}