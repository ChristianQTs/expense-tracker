import type { ReactNode } from 'react';
import { createContext, useState } from "react";
import type { AuthenticatedUser } from '@expense-tracker/shared';
import { makeLoginRequest, makeRegisterRequest, makeLogoutRequest } from '../requests/authRequests.js';

interface AuthContextType {
    user: AuthenticatedUser | null;
    updateUser: (newUser: AuthenticatedUser) => void;
    login: (username: string, password: string) => Promise<{ success: boolean, message?: string }>;
    register: (username: string, password: string) => Promise<{ success: boolean, message?: string }>;
    logout:() => Promise<void>
}
interface AuthProviderProps {
    children : ReactNode
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }:AuthProviderProps) {

    const [user, setUser] = useState<AuthenticatedUser | null>(() => {
        const storedUser = localStorage.getItem('user')
        return storedUser ? JSON.parse(storedUser) : null
    })


    const login = async (username:string, password:string) => {

        try {

            const res = await makeLoginRequest(username, password)

                setUser(res.user)
                localStorage.setItem('user', JSON.stringify(res.user))
                return { success: true }

        } catch (err:any) {
            return {success : false, message : err.message}
        }
    }

    const register = async (username:string, password:string) => {

        try {

            await makeRegisterRequest(username, password)
            return { success: true }
        }
        catch (err:any) {
            return {success : false, message : err.message}
        }
    }

    const logout = async () => {

        try {
            await makeLogoutRequest()
        } catch (err) {
            console.error('Logout failed, clearing local state...', err)
        } finally {
            localStorage.removeItem('user')
            setUser(null)
        } 
    }
    const updateUser =(newUser:AuthenticatedUser) => {

        localStorage.setItem('user', JSON.stringify(newUser))
        setUser(newUser)
    }
    return (
        <AuthContext.Provider value={{ user, updateUser, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}



export { AuthContext };
