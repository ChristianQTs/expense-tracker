import { Helmet } from 'react-helmet-async'
import { useAuth } from '../authContext.jsx'
import { useLanguage } from '../language/LanguageContext.js'
import { LanguageSelect } from '../language/languageSelect.jsx'
import {Button} from '../components/styling comps/Button.js'
import { Link } from 'react-router-dom'
import transportationIcon from '../assets/transportation.svg';
import debtIcon from '../assets/debt.svg';
import personalIcon from '../assets/personal.svg';
import medicalIcon from '../assets/medical.svg';
import entertainmentlIcon from '../assets/entertainment.svg';
import householdIcon from '../assets/household.svg';
const iconProps = 'h-16 w-32 md:h-32 md:w-56 fill-gray-50/50'



export function Home() { 
    const {user,logout} = useAuth()
    const {t} = useLanguage()
    return (
        <div className='flex flex-col min-h-screen bg-gray-50/50'>
            <Helmet>
                <title>{t('pageTitle')}</title>
                <meta name="google-site-verification" content="CrP1LAbfIxBrvD8w4cyzDQC_b9HascS4fIXEb5BFimU" />
                <meta name="description" content={t('slogan')} />
                <link rel="canonical" href="https://expense-tracker-qt.vercel.app/home" />
            </Helmet>
            <nav className='flex flex-col md:flex-row gap-3 justify-center p-4 items-center border border-gray-200 w-full bg-gray-100'>
                <a href={`${window.location.origin}/home`} className='mb-2 text-center text-4xl font-bold text-blue-700 transition duration-300 hover:scale-110'>{t('pageTitle')}</a>
                {!user ? <div className='flex flex-wrap justify-center gap-3 md:ml-auto'>
                    <Link to='/login' className='text-blue-600 hover:underline font-medium'>{t('loginButton')}</Link>
                    <Link to='/register' className='text-blue-600 hover:underline font-medium'>{t('register')}</Link>
                    
                </div> :
                <div className='flex flex-wrap justify-center gap-3 md:ml-auto'>
                        <p className='text-lg font-semibold text-blue-700'>{user.username}</p>
                    <Button onClick={async () => { await logout() }} styleType='auth'>{t('logout')}</Button>
                </div>
            }
                <LanguageSelect />
            </nav>
            <div className='p-5'>
                <p className='text-center text-4xl font-bold italic text-blue-900'>{t('slogan')}</p>
            </div>
            <div className='p-12 flex flex-col md:flex-row gap-8 items-center justify-center border border-gray-300 w-full'>
                <section className='p-5 border rounded-md border-gray-200 bg-gray-100 hover:shadow-md duration-200 items-strecth flex-1'>
                    <p className='text-center text-xl text-blue-800 font-bold'>{t('prod_desc1')}</p>
                </section>
                <section className='p-5 border rounded-md border-gray-200 bg-gray-100 hover:shadow-md duration-200 items-strecth flex-1'>
                    <p className='text-center text-xl text-blue-800 font-bold'>{t('prod_desc2')}</p>
                </section>
            </div>
            <div id='mim' className='flex justify-center p-20'>
                <Link to={user ? '/expenses' : '/login'} className='transition hover:-translate-y-1 duration-200 focus:outline focus:outline-offset-2 focus:outline-blue-700 p-5 border rounded-md border-gray-200 bg-blue-700 text-white hover:bg-blue-900 text-center w-full max-w-xs block'>
                    <p className='text-xl font-semibold italic'>{t('startTracking')}</p>
                </Link>
            </div>
            <footer className="mt-auto">
                <div className='flex md:flex-row md:flex-nowrap flex-wrap gap-5 items-center justify-center'>
                    <img src={transportationIcon} alt = 'Transportation Expenses'className={iconProps}></img>
                    <img src={debtIcon} alt = 'Debt Expenses' className={iconProps}></img>
                    <img src={personalIcon} alt = 'Personal Expenses' className={iconProps}></img>
                    <img src={medicalIcon} alt = 'Medical Expenses'className={iconProps}></img>
                    <img src={entertainmentlIcon} alt = 'Entertainment Expenses' className={iconProps}></img>
                    <img src={householdIcon} alt = 'Household Expenses' className={iconProps}></img>
                </div>
            </footer>
        </div>
    )
}