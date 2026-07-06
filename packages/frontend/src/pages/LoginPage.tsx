import { useAuth } from '../authContext.jsx'
import { useLanguage } from '../language/LanguageContext.js'
import { useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, inputStyle } from '../components/styling comps/Button.js'
import { LanguageSelect } from '../language/languageSelect.jsx'



export function LoginPage() {

    const { login } = useAuth()
    const {t} = useLanguage()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string>('')
    const navigate = useNavigate()

    const handleLogin = async (e: any) => {
        e.preventDefault()
        setError('')

        if (!username.trim() || !password.trim()) {
            setError('Missing values')
            return
        }

        const res = await login(username, password)

        if (!res.success) {
            setError(res.message!)
            setUsername('')
            setPassword('')
            return 
        }
          (window as any).__justLoggedIn = true;
          navigate('/expenses')

    }

    return (
        <div className='min-h-screen bg-white flex flex-col items-center justify-center p-4'>
            <LanguageSelect/>
            <a href={`${window.location.origin}/home`} className='mb-2 text-4xl md:text-5xl font-bold text-blue-700 text-center transition duration-300 hover:scale-110'>{t('pageTitle')}</a>
            <h2 className='mb-8 text-xl md:text-2xl font-semibold text-gray-700'>{t('login')}</h2>

            <div className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-md'>
                <form className='flex flex-col gap-4' onSubmit={handleLogin}>

                    <div className='flex items-center gap-2 w-full justify-center'>
                        <label className='w-20 shrink-0 md:w-18 font-medium' htmlFor='username'>Username: </label>
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
                        <label className='w-20 shrink-0 md:w-18 font-medium' htmlFor='password'>Password: </label>
                        <input
                            id='password'
                            className={`${inputStyle} flex-1`}
                            type='password'
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="*******"
                        />
                    </div>
                    <div className="w-full flex justify-center mt-2">
                        <Button
                            styleType='auth'
                            type='submit'
                            className="w-full md:w-auto text-center flex items-center justify-center h-[36px]"
                            isDisabled={!username.trim() || !password.trim()}
                        >
                            {t('loginButton')}
                        </Button>
                    </div>
                </form>

                {error && <p className='mt-4 text-red-500 text-center text-sm'>{error}</p>}

                <p className='text-center mt-6 text-sm md:text-base text-gray-600'>
                    {t('noAccountQuestion')} {' '}
                    <Link to='/register' className='text-blue-600 hover:underline font-medium'>{t('register')}</Link>
                </p>
            </div>
        </div>
    )
}