import { fetchApi } from '../utilities/fetchWrapper.js'
import type { ClientExpense, AddBody, UpdateBody } from '@expense-tracker/shared'

interface setBudgetResponse {
    type: 'monthly' | 'quarterly' | 'yearly',
    budget : number
}
interface deleteBudgetResponse {
    type: 'monthly' | 'quarterly' | 'yearly',
    success: boolean;
    message?:string
}

export async function getExpenses(start? : string, end?: string): Promise<ClientExpense[]> {

    const params = new URLSearchParams()

    if (start) params.append('start', start)
    if (end) params.append('end', end)

    const queryString = params.toString()

    const URL = queryString ? `/expenses?${queryString}` : '/expenses'

    const response  = await fetchApi<ClientExpense[]>(URL)
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

export async function setUserBudget(budget: number, budgetType: 'monthly' | 'quarterly' | 'yearly'): Promise<setBudgetResponse> {
    const response = await fetchApi<setBudgetResponse>(`/budget/set?type=${budgetType}`, {
        method: 'PATCH',
        body: { budget },
    })
        
    return response
}

export async function deleteUserBudget(budgetType: 'monthly' | 'quarterly' | 'yearly'):Promise<deleteBudgetResponse> {

    const response = await fetchApi<deleteBudgetResponse>(`/budget/delete?type=${budgetType}`, {
        method : 'PATCH'
    })
    return response
}