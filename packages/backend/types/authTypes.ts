import type { users } from '@prisma/client'

export type AuthenticatedUser = Pick<users, 'id' | 'username'> & { budget:  number | null }
export interface AuthBody {
    username: string,
    password: string
}
export interface RegisterResponse {
    user: Pick<users, 'id' | 'username'>
}
export interface LoginResponse {
    user: AuthenticatedUser,
    token:string
}


