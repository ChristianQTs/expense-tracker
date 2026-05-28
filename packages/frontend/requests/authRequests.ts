import { fetchApi } from '../fetchWrapper.js'
import type { RegisterResponse, LoginResponse } from '@expense-tracker/shared'

export async function makeRegisterRequest(username : string, password:string):Promise<RegisterResponse> {

    const res = await fetchApi<RegisterResponse>('/auth/register', {
        method : 'POST',
        body: {username, password}
    })
    return res
}

export async function makeLoginRequest(username : string, password : string):Promise<LoginResponse> {

    const res = await fetchApi<LoginResponse>('/auth/login', {
        method : 'POST',
        body: {username, password}
    })
    
    return res
}

export async function makeLogoutRequest(): Promise<{message: string} > {
    return await fetchApi<{ message: string }>('/auth/logout', {
        method : 'POST'
    })
}