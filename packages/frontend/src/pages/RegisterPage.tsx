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
        <div className='min-h-screen bg-white flex flex-col items-center justify-center p-4'>
            <h1 className='mb-2 text-4xl md:text-5xl font-bold text-blue-700 text-center'>Expense Tracker</h1>
            <h2 className='mb-8 text-xl md:text-2xl font-semibold text-gray-700'>Register here</h2>

            <div className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-md'>
                <form className='flex flex-col gap-4' onSubmit={handleRegister}>
                    <div className='flex items-center gap-2 w-full justify-center'>
                        <label className='w-36 shrink-0 md:w-32 font-medium text-sm md:text-base' htmlFor='username'>Username: </label>
                        <input
                            id='username'
                            className={`${inputStyle} flex-1`}
                            type='text'
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className='flex items-center gap-2 w-full justify-center'>
                        <label className='w-36 shrink-0 md:w-32 font-medium text-sm md:text-base' htmlFor='password'>Password: </label>
                        <input
                            id='password'
                            className={`${inputStyle} flex-1`}
                            type='password'
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='flex items-center gap-2 w-full justify-center'>
                        <label className='w-36 shrink-0 md:w-32 font-medium text-sm md:text-base' htmlFor='confirmPassword'>Confirm Password: </label>
                        <input
                            id='confirmPassword'
                            className={`${inputStyle} flex-1`}
                            type='password'
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {(password !== confirmPassword && confirmPassword) && (
                        <p className='mt-2 text-red-500 text-center text-sm font-medium'>Passwords must match</p>
                    )}
                    <div className="w-full flex justify-center mt-2">
                        <Button
                            styleType='auth'
                            type='submit'
                            className="w-full md:w-auto text-center flex items-center justify-center h-[36px]"
                            isDisabled={!username.trim() || !password.trim() || password !== confirmPassword}
                        >
                            Register
                        </Button>
                    </div>
                </form>

                {(error && !username) && <p className='mt-4 text-red-500 text-center text-sm'>{error}</p>}

                <p className='text-center mt-6 text-sm md:text-base text-gray-600'>
                    Already have an account?{' '}
                    <Link className='text-blue-600 hover:underline font-medium' to='/login'>Login</Link>
                </p>
            </div>
        </div>
    )
}