import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './authContext.jsx'
import { LanguageProvider} from './language/LanguageContext.js'
import './style.css'
import { LoginPage } from './pages/LoginPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { ExpenseTrackerPage } from './pages/ExpenseTrackerPage.jsx'
import { makeMeRequest } from '../requests/authRequests.js'

function ProtecetdRoute() {
    const { user, setUser } = useAuth()
    const [authLoading, setAuthLoading] = useState(!(window as any).__justLoggedIn)

    useEffect(() => {
        if ((window as any).__justLoggedIn) {
            (window as any).__justLoggedIn = false;
            return;
        }
        makeMeRequest()
            .then(user => setUser(user))
            .catch(() => setUser(null!))
            .finally(() => setAuthLoading(false))
    }, [])

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center">Verifying session...</div>
    }
    

    if (!user) {
        return <Navigate to = '/login' replace />
    }
    return <Outlet />;
}


const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <RegisterPage />
    },
    {
        element: <ProtecetdRoute />,
        children: [
            {
                path: '/expenses',
                element: <ExpenseTrackerPage/>
            }
        ]
    },
    {
        path: '*',
        element: <div>404 - Page Not Found</div>
    }
])


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LanguageProvider>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </LanguageProvider>
    </StrictMode>,
)
