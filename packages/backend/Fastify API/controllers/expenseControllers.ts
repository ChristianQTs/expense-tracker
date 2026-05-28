import prisma from '../../prisma/prismaClient.js'
import type { expenses } from '@prisma/client'
import type { FastifyRequest, FastifyReply } from 'fastify'
import type { AddBody, ExpenseParams,UpdateBody } from '../../types/expensesTypes.js'

export async function getExpenses(request: FastifyRequest, reply: FastifyReply) {

    if (!request.user) return reply.code(401).send({message : 'Unauthorized'})

    const userId = request.user.id
    const userExpenses  = await prisma.expenses.findMany({ where: { user_id: userId } })

    return  userExpenses
}

export async function addExpense(request: FastifyRequest<{Body : AddBody}>, reply: FastifyReply) {

        if (!request.user) return reply.code(401).send({ message: 'Unauthorized' })
        const user_id = request.user.id

        const { name, amount, category } = request.body

    const newExpense : expenses = await prisma.expenses.create({
       data: {user_id, name, amount, category}
    })

    return reply.code(201).send(newExpense)
}

export async function updateExpense(request: FastifyRequest<{Body:UpdateBody, Params:ExpenseParams}>, reply: FastifyReply) {

    if (!request.user) return reply.code(401).send({ message: 'Unauthorized' })
    const user_id = request.user.id
    const expense_id  = parseInt(request.params.expenseId, 10)

    const { name, amount, category } = request.body
    const data : UpdateBody = {}

    if (name !== undefined) data.name = name
    if (amount !== undefined) data.amount = amount
    if (category !== undefined) data.category = category

    try {
        const updatedExpense : expenses = await prisma.expenses.update({ where: { id: expense_id, user_id: user_id }, data })
        return  updatedExpense 
    } catch (err : any) {
        if (err.code === 'P2025') return reply.code(404).send({ message: 'Expense not found.' })
        return reply.code(500).send({message : 'Something went wrong.'})
    }
}

export async function deleteExpense(request: FastifyRequest<{Params:ExpenseParams}>, reply: FastifyReply) {

    if (!request.user) return reply.code(401).send({ message: 'Unauthorized' })
    const user_id = request.user.id
    const expenseId = parseInt(request.params.expenseId, 10)

    try {
        await prisma.expenses.delete({ where: { id: expenseId, user_id: user_id } })
        return expenseId 
    } catch (err : any) {
        if (err.code === 'P2025') return reply.code(404).send({ message: 'Expense not found.' })
        return reply.code(500).send({ message: 'Something went wrong.' })
    }
}