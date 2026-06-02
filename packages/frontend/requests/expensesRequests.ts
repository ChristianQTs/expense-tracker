import { fetchApi } from '../fetchWrapper.js'
import type { ClientExpense, AddBody, UpdateBody } from '@expense-tracker/shared'
interface deleteBudgetResponse {
    success: boolean;
    message?:string
}

export async function getExpenses(): Promise<ClientExpense[]> {
    
    const response  = await fetchApi<ClientExpense[]>('/expenses')
    return response
}

export async function addExpense({ name, amount, category }: AddBody): Promise<ClientExpense> {

    const response = await fetchApi<ClientExpense>('/expenses', {
        method: 'POST',
        body: { name, amount, category },
        
    })
    return response
}

export async function deleteExpense(expenseId:number):Promise<number> {
    //NOTE: adding expenseId to the URL will make it dynamic and cause the browser to send a new Preflight for every subsequent DELETE request. Moving the ID to request BODY will solve this

    const response = await fetchApi<number>(`/expenses/${expenseId}`, {
        method: 'DELETE',
    })
    return response
}

export async function updateExpense(updates: UpdateBody, expenseId: number): Promise<ClientExpense> {

    const response = await fetchApi<ClientExpense>(`/expenses/${expenseId}`, {
        method: 'PATCH',
        body: updates
    })
    return response
}

export async function setUserBudget(budget:number):Promise<number> {

    const response = await fetchApi<number>('/budget/set', {
            method: 'PATCH',
            body: {budget},
        })
    return response
}

export async function deleteUserBudget():Promise<deleteBudgetResponse> {

    const response = await fetchApi<deleteBudgetResponse>('/budget/delete', {
        method : 'PATCH'
    })
    return response
}