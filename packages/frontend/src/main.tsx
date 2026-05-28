import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
                    <Route path='/login' element={<LoginPage/>}/>
                    <Route path='/register' element={<RegisterPage/>}/>
                    <Route path='/expenses' element={<ExpenseTrackerPage/>}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
  </StrictMode>,
)
