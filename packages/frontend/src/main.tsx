import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './authContext.jsx'
import './style.css'
import { LoginPage } from './pages/LoginPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { ExpenseTrackerPage } from './pages/ExpenseTrackerPage.jsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path='/login' element={<LoginPage/>}/>
                    <Route path='/register' element={<RegisterPage/>}/>
                    <Route path='/expenses' element={<ExpenseTrackerPage />} />
                    <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
  </StrictMode>,
)
