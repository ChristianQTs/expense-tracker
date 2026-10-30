import type { expenses } from '@prisma/client'
export type ClientExpense = Omit<expenses, 'user_id' | 'amount'> & { amount: number }
export interface AddBody {
    name: string,
    amount: number,
    category: string,
    date: Date
}
export interface UpdateBody {
    name?: string,
    amount?: number,
    category?: string,
    date?: Date
}

export interface ExpenseParams {
    expenseId: string
}