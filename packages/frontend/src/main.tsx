import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './authContext.jsx'
import { LanguageProvider} from './language/LanguageContext.js'
import './style.css'
import { LoginPage } from './pages/LoginPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { ExpenseTrackerPage, expensesLoader } from './pages/ExpenseTrackerPage.jsx'

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
        path: '/expenses',
        loader: expensesLoader,
        element: <ExpenseTrackerPage />
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
