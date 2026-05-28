import { useState, useContext } from 'react'
import { AuthContext } from '../authContext.jsx'
import { useNavigate, Link } from 'react-router-dom'
import { Button, inputStyle } from '../components/styling comps/Button.js'


export function RegisterPage() {

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const { register } = useContext(AuthContext)!
    const [error, setError] = useState<string>('')
    const navigate = useNavigate()

    const handleRegister = async (e:any) => {
        e.preventDefault()
        setError('')

        if (!username.trim() || !password.trim()) {
            setError('Missing values')
            return
        } 

        const res = await register(username, password)
        if (!res.success) {
            setError(res.message!)
            setUsername('')
            setPassword('')
            setConfirmPassword('')
            return
        }
        navigate('/login')
    }

    return (
        <div className='min-h-screen bg-white flex flex-col items-center justify-center'>
            <h1 className='mb-2 text-5xl font-bold text-blue-700'>Expense Tracker</h1>
            <h2 className='mb-8 text-2xl font-semibold text-gray-700'>Register here</h2>
            <div className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-md'>
                <form className='flex flex-col gap-4' onSubmit={handleRegister}>
                    <div className='flex items-center gap-4 justify-center'>
                        <label className='w-18 font-medium'>Username: </label>
                        <input className={inputStyle} type='text' required value={username} onChange={e => setUsername(e.target.value)} /> 
                    </div>
                    <div className='flex items-center gap-4 justify-center'>
                        <label className='w-18 font-medium'>Password: </label>
                        <input className={inputStyle} type='password' required value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className='flex items-center gap-4 justify-center'>
                        <label className='w-18 font-medium'>Confirm Password: </label>
                        <input className={inputStyle} type='password' required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                    {(password !== confirmPassword && confirmPassword) && <p className='mt-4 text-red-500 text-center'>Password must match</p>}
                    <Button styleType='auth' type='submit' isDisabled={!username.trim() || !password.trim() || password !== confirmPassword}>Register</Button>            
                </form>
                {(error && !username) && <p className='mt-4 text-red-500 text-center'>{error}</p>}
                <p className='text-center'>
                    Already have an account?{' '}
                    <Link className='text-blue-600 hover:underline' to='/login'>Login</Link>
                </p>
            </div>
        </div>
    )
}