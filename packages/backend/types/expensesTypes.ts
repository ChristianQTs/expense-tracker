import type { expenses } from '@prisma/client'
export type ClientExpense = Omit<expenses, 'user_id' | 'amount'> & { amount: number }
export interface AddBody {
    name: string,
    amount: number,
    category: string
}
export interface UpdateBody {
    name?: string,
    amount?: number,
    category?: string
}

export interface ExpenseParams {
    expenseId: string
}