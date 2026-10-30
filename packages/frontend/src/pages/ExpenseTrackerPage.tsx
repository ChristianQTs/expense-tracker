import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LanguageSelect } from '../language/languageSelect.jsx'
import { useLanguage } from '../language/LanguageContext.js'
import { AddExpense } from '../components/AddExpense.jsx'
import { ExpensesList } from '../components/ExpensesList.jsx'
import { ExpenseDateFilter } from '../components/expenseCustomPeriodFilter.jsx'
import { Filter } from '../components/Filter.jsx'
import { Budget } from '../components/Budget.jsx'
import { getExpenses, addExpense, deleteExpense, updateExpense, setUserBudget, deleteUserBudget } from '../../requests/expensesRequests.js'
import type { ClientExpense, AddBody, UpdateBody } from '@expense-tracker/shared'
import { useAuth } from '../authContext.jsx'
import { Button } from '../components/styling comps/Button.jsx'
import { getDateRange } from '../../utilities/dateUtilities.js'



export function ExpenseTrackerPage() {

    const [error, setError] = useState<string>('')
    const [expenses, setExpenses] = useState<ClientExpense[]>([])
    const [filter, setFilter] = useState<string>('all')
    const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly' | 'all' | 'custom'>('monthly')
    const [customRange, setCustomRange] = useState<{ start?: string; end?: string }>({})
    const { start, end } = period === 'custom' ? customRange : getDateRange(period)
    const isFiltered: boolean = filter !== 'all'
    const filteredExpenses: ClientExpense[] = isFiltered ? expenses.filter(e => e.category === filter) : expenses
    const [showBudget, setShowBudget] = useState<boolean>(false)
    const {t, language} = useLanguage()
    const { user, updateUser, logout } = useAuth()
    const navigate = useNavigate()
    const [cache, setCache] = useState<Record<string, ClientExpense[] | null>>({
        monthly: null,
        quarterly: null,
        yearly: null,
        all: null
    })
   

    useEffect(() => {
        if (period === 'custom') return

        if (cache[period] !== null) {
            setExpenses(cache[period]!)
            return
        }    
        getExpenses(start, end).then(expenses => {
            setExpenses(expenses)
            setCache(prev => ({...prev, [period]:expenses}))
        }
        ).catch(err => setError(err.message || 'Failed to load expenses'))
    }, [user, period, start, end])

   useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (isFiltered && filteredExpenses.length === 0) setFilter('all')
    }, [filteredExpenses, isFiltered])


    const handleDeleteExpense = async (id: number) => {
        setError('')
        try {
            const expenseId = await deleteExpense(id)

            if (!expenseId) return
            setExpenses(prev => prev.filter(e => e.id !== expenseId))
            //Update Cache:
            setCache(prev => ({
                monthly: period === 'monthly' ? prev.monthly!.filter(e => e.id !== expenseId) : null,
                quarterly: period === 'quarterly' ? prev.quarterly!.filter(e => e.id !== expenseId) : null,
                yearly: period === 'yearly' ? prev.yearly!.filter(e => e.id !== expenseId) : null,
                all: period === 'all' ? prev.all!.filter(e => e.id !== expenseId) : null,
            }))
            
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleAddExpense = async ({ name, amount, category, date }: AddBody) => {
        setError('')
        try {
            const res = await addExpense({ name, amount, category, date })
            const expenseTimestamp = new Date(res.created_at).getTime()
            const isInCurrentPeriod = period === 'all' || (
                start !== undefined && end !== undefined &&
                expenseTimestamp >= Date.parse(start) && expenseTimestamp <= Date.parse(end)
            )
            if (isInCurrentPeriod) setExpenses(prev => [...prev, res])

            const updatePeriodCache = (cachePeriod: 'monthly' | 'quarterly' | 'yearly' | 'all', cachedExpenses: ClientExpense[] | null) => {
                if (period !== cachePeriod) return null
                if (!isInCurrentPeriod || cachedExpenses === null) return cachedExpenses
                return [...cachedExpenses, res]
            }
            setCache(prev => ({
                monthly: updatePeriodCache('monthly', prev.monthly),
                quarterly: updatePeriodCache('quarterly', prev.quarterly),
                yearly: updatePeriodCache('yearly', prev.yearly),
                all: updatePeriodCache('all', prev.all),
            }))

        } catch (err: any) {
            setError(err.message)

        }
    }

    const handleUpdateExpense = async (expenseId: number, updates: UpdateBody) => {
        setError('')
        try {
            const updatedExpense = await updateExpense(updates, expenseId)
            setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e))
            setCache(prev => ({
                monthly: period === 'monthly' ? prev.monthly!.map(e => e.id === updatedExpense.id ? updatedExpense : e) : null,
                quarterly: period === 'quarterly' ? prev.quarterly!.map(e => e.id === updatedExpense.id ? updatedExpense : e) : null,
                yearly: period === 'yearly' ? prev.yearly!.map(e => e.id === updatedExpense.id ? updatedExpense : e) : null,
                all: period === 'all' ? prev.all!.map(e => e.id === updatedExpense.id ? updatedExpense : e) : null,
            }))


        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleAddBudget = async (value: number, type: 'monthly' | 'quarterly' | 'yearly') => {
        if (!user) return
        try {
            const response = await setUserBudget(value, type)
            if (response.type === 'monthly'){
                updateUser({ ...user, monthly_budget: response.budget })
                
            }
            if (response.type === 'quarterly') {
                updateUser({ ...user, quarterly_budget : response.budget})
            }
            if (response.type === 'yearly') {
                updateUser({ ...user, yearly_budget : response.budget}) 
            }
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleDeleteBudget = async (type: 'monthly' | 'quarterly' | 'yearly') => {
        if (!user) return
        try {
            const response = await deleteUserBudget(type)
            if (!response.success) return
            if (response.type === 'monthly'){
                updateUser({ ...user, monthly_budget: null })
            }
            if (response.type === 'quarterly') {
                updateUser({ ...user, quarterly_budget: null })
            }
            if (response.type === 'yearly') {
                updateUser({ ...user, yearly_budget: null })
            }
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleLogout = async () => {
        if (!user) return
        await logout()
        navigate('/login')
    }

    const totalExpense = expenses.length !== 0 ? expenses.reduce((tot, exp) => tot + Number(exp.amount), 0) : 0
    const totalCategory = expenses.length !== 0 ? filteredExpenses.reduce((tot, exp) => tot + Number(exp.amount), 0) : 0
    const categoryPercentage = totalExpense !== 0 ? totalCategory * 100 / totalExpense  : 0

    return (
        <div className='min-h-screen bg-mist-100 flex flex-col'>
            <a href={`${window.location.origin}/home`} className='py-7 mb-2 text-center text-4xl font-bold text-blue-700 transition duration-300 hover:scale-110 w-fit self-center'>{t('pageTitle')}</a>

            <div className='flex items-center justify-center gap-2.5'>
                <h2>{t('welcome')} <strong>{user?.username}</strong>!</h2>
                <Button onClick={handleLogout} styleType='auth'>{t('logout')}</Button>
            </div>
            <div className='flex p-3 justify-center'>
                <LanguageSelect/>
            </div>
            <div className='flex items-center justify-center gap-2.5'>
                <AddExpense onAdd={handleAddExpense}>
                    <Button className='flex-1 md:w-auto h-fit whitespace-nowrap max-md:px-2 max-md:py-0.5 max-md:text-s max-md:font-medium' onClick={() => setShowBudget(prev => !prev)}>
                        {showBudget ? t('hideBudget') :  t('showBudget') }
                    </Button>
                </AddExpense>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
               {error !== '' ? <p style={{ color: 'red' }}>{error}</p> : null}
               {error !== '' ? <Button onClick={() => setError('')}>Ok</Button> : null}
            </div>
            {showBudget && <Budget total={totalExpense} user={user!} onSetBudget={handleAddBudget} onDeleteBudget={handleDeleteBudget} expensePeriod={period} />}
            <div className='flex flex-wrap gap-3 md:gap-6 justify-center items-center'>
                <p className='text-gray-600 font-medium text-m'>{t('selectExpensePeriod')}: </p>
                <div className='flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center w-full'>
                    <div className='flex gap-3 md:gap-12 items-center justify-center'>
                        <button onClick={() => setPeriod('monthly')} className={`hover:scale-110 duration-200 cursor-pointer border-2 border-cyan-600 border-solid rounded-sm h-fit py-1.5 px-4 md:px-6 font-semibold ${period === 'monthly' ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600'}`}>{t('month')}</button>
                        <button onClick={() => setPeriod('quarterly')} className={`hover:scale-110 duration-200 cursor-pointer border-2 border-cyan-600 border-solid rounded-sm h-fit py-1.5 px-4 md:px-6 font-semibold ${period === 'quarterly' ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600'}`}>{t('quarter')}</button>
                        <button onClick={() => setPeriod('yearly')} className={`hover:scale-110 duration-200 cursor-pointer border-2 border-cyan-600 border-solid rounded-sm h-fit py-1.5 px-4 md:px-6 font-semibold ${period === 'yearly' ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600'}`}>{t('year')}</button>
                        <button onClick={() => setPeriod('all')} className={`hover:scale-110 duration-200 cursor-pointer border-2 border-cyan-600 border-solid rounded-sm h-fit py-1.5 px-4 md:px-6 font-semibold ${period === 'all' ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600'}`}>{t('all')}</button>
                    </div>
                    <ExpenseDateFilter

                        onApplyFilter={async (start, end) => {
                            const startIso = start.toISOString()
                            const endIso = end.toISOString()
                            try {
                                const customDateExpenses = await getExpenses(startIso, endIso)
                                setExpenses(customDateExpenses)
                                setCustomRange({ start: startIso, end: endIso })
                                setPeriod('custom')
                            } catch (err: any) {
                                setError(err.message || 'Failed to fetch custom date expenses')
                            }
                        }}

                        onClearFilter={() => {
                            setCustomRange({})
                            setPeriod('monthly')
                        }}
                    />
                </div>
            </div>
            {expenses.length !== 0 && <Filter expenses={expenses} filter={filter} setFilter={setFilter} />}
            {(expenses.length !== 0 && period !== 'all') && 
                <div className="w-full max-w-2xl mx-auto px-4 animate-fadeIn flex justify-center">
                    <p className="text-center md:text-left text-xs md:text-sm font-medium tracking-wide text-slate-500 bg-slate-100/60 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200/50 shadow-xs">
                        <span className="inline-block text-cyan-600 text-sm">📅</span>
                        <span>
                            {t('expensesFrom')} <strong className="text-slate-800 font-semibold">{new Date(start!).toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US')}</strong> {t('to')} <strong className="text-slate-800 font-semibold">{new Date(end!).toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US')}</strong>
                        </span>
                    </p>
                </div>
        }

            <ExpensesList expenses={filteredExpenses} onDelete={handleDeleteExpense} onUpdate={handleUpdateExpense} period={period} />

            {/* Total and Filtering Dashboard Box */}
            <div className='flex flex-col md:flex-row p-4 items-stretch md:items-center justify-center gap-4 md:gap-6 bg-blue-50/80 border border-blue-100 rounded-lg text-sm md:text-base shadow-sm w-max max-w-full mx-auto font-medium text-blue-900'>

                {/* 1. Global Total */}
                <div className='flex flex-col md:flex-row md:items-center justify-center text-center md:text-left gap-0.5 md:gap-2 w-full md:w-auto'>
                    <span className='text-xs md:text-sm uppercase tracking-wider md:normal-case md:tracking-normal text-blue-700 md:text-blue-900'>{period === 'monthly' ? t('monthlyTotal') : period === 'quarterly' ? t('quarterlyTotal') : period ==='yearly' ? t('yearlyTotal') : t('total')}: </span>
                    <span className='font-bold text-base md:text-lg text-black'>{totalExpense.toFixed(2) as unknown as number} &euro;</span>
                </div>
                {isFiltered && (
                    <>
                        <span className="hidden md:inline text-blue-300">|</span>
                        <hr className="block md:hidden border-blue-100/70 my-0.5" />

                        {/* 2. Category Total */}
                        <div className='flex flex-col md:flex-row md:items-center justify-center text-center md:text-left gap-0.5 md:gap-2 w-full md:w-auto'>
                            <span className='text-xs md:text-sm uppercase tracking-wider md:normal-case md:tracking-normal text-blue-700 md:text-blue-900'>{language === 'it' ? `Totale ${t(filter as any)}` : `${t(filter as any)} Total`}: </span>
                            <span className='text-black font-bold text-base md:text-lg'>{totalCategory.toFixed(2)} &euro;</span>
                        </div>

                        <span className="hidden md:inline text-blue-300">|</span>
                        <hr className="block md:hidden border-blue-100/70 my-0.5" />

                        {/* 3. Percentage */}
                        <div className='flex flex-col md:flex-row md:items-center justify-center text-center md:text-left gap-0.5 md:gap-2 w-full md:w-auto'>
                            <span className='text-xs md:text-sm uppercase tracking-wider md:normal-case md:tracking-normal text-blue-700 md:text-blue-900'>{language === 'it' ? `% ${t(filter as any)} del totale` : `${t(filter as any)} % of total`}: </span>
                            <span className='text-black font-bold text-base md:text-lg'>{categoryPercentage > 1 ? Math.floor(categoryPercentage) : categoryPercentage.toFixed(1)} %</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
