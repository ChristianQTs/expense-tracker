import prisma from '../../prisma/prismaClient.js'
import type { FastifyRequest, FastifyReply} from 'fastify'
interface SetBody {
    budget : number
}
export async function setBudget(request: FastifyRequest<{Body:SetBody}>, reply : FastifyReply) {

    if (!request.user) return reply.code(401).send({ message: 'Unauthorized' })

    const user_id = request.user.id
    const { budget } = request.body

    try {
        await prisma.users.update({ where: { id: user_id }, data: { budget } })
        return  budget 
    }
    catch (err : any) {
        console.error(err)
        if (err.code === 'P2025') return reply.code(404).send({ message: 'User not found' })
        return reply.code(500).send({ message: 'Something went wrong.' })
    }
}

export async function deleteBudget(request: FastifyRequest, reply : FastifyReply) {

    if (!request.user) return reply.code(401).send({ message: 'Unauthorized' })

    const user_id = request.user.id

    try {

        await prisma.users.update({ where: { id: user_id }, data: { budget: null } })
        return {success : true}
    }
    catch (err : any) {
        console.error(err)
        if (err.code === 'P2025') return reply.code(404).send({ success: false, message: 'User not found' })
        return reply.code(500).send({ success : false, message: 'Something went wrong.' })
    }
}