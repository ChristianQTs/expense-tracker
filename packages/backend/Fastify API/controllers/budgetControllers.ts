import prisma from '../../prisma/prismaClient.js'
import type { FastifyRequest, FastifyReply} from 'fastify'
interface SetBudgetBody {
    budget : number
}
interface BudgetQuery {
    type : 'monthly'| 'quarterly'| 'yearly'
}
export async function setBudget(request: FastifyRequest<{ Querystring: BudgetQuery, Body: SetBudgetBody }>, reply : FastifyReply) {

    if (!request.user) return reply.code(401).send({ message: 'Unauthorized' })

    const user_id = request.user.id
    const budgetType = request.query.type
    const { budget } = request.body
    const parsedBudget = Number(budget)
    if (budget === undefined || isNaN(parsedBudget)) {
        return reply.code(400).send({
            success: false,
            message : 'Invalid budget received'
        })
    }

    try {
        if (budgetType === 'monthly') {
            await prisma.users.update({ where: { id: user_id }, data: { monthly_budget: parsedBudget } })
            return { success: true, type:budgetType, budget : parsedBudget}
        }
        if (budgetType === 'quarterly') {
            await prisma.users.update({ where: { id: user_id }, data: { quarterly_budget: parsedBudget } })
            return { success: true, type: budgetType, budget: parsedBudget }
        }
        if (budgetType === 'yearly') {
            await prisma.users.update({ where: { id: user_id }, data: { yearly_budget: parsedBudget } })
            return { success: true, type: budgetType, budget: parsedBudget }
        }

        return reply.code(400).send({
            success: false,
            message: 'Invalid budget type'
        })
        
    }
    catch (err : any) {
        console.error(err)
        if (err.code === 'P2025') return reply.code(404).send({ message: 'User not found' })
        return reply.code(500).send({ success:false, message: 'Something went wrong.' })
    }
}

export async function deleteBudget(request: FastifyRequest<{Querystring:BudgetQuery}>, reply : FastifyReply) {

    if (!request.user) return reply.code(401).send({ message: 'Unauthorized' })

    const user_id = request.user.id
    const budgetType = request.query.type
    try {
        if (budgetType === 'monthly') {
            await prisma.users.update({ where: { id: user_id }, data: { monthly_budget: null } })
            return { success: true, type: budgetType }
        }
        if (budgetType === 'quarterly') {
            await prisma.users.update({ where: { id: user_id }, data: { quarterly_budget: null } })
            return { success: true, type: budgetType }
        }
        if (budgetType === 'yearly') {
            await prisma.users.update({ where: { id: user_id }, data: { yearly_budget: null } })
            return { success: true, type: budgetType }
        }

        return reply.code(400).send({
            success: false,
            message : 'Invalid budget type'
        })
    }
    catch (err : any) {
        console.error(err)
        if (err.code === 'P2025') return reply.code(404).send({ success: false, message: 'User not found' })
        return reply.code(500).send({ success : false, message: 'Something went wrong.' })
    }
}