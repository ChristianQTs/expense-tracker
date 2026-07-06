import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LanguageSelect } from '../language/languageSelect.jsx'
import { useLanguage } from '../language/LanguageContext.js'
import { AddExpense } from '../components/AddExpense.jsx'
import { ExpensesList } from '../components/ExpensesList.jsx'
import { Filter } from '../components/Filter.jsx'
import { Budget } from '../components/Budget.jsx'
import { getExpenses, addExpense, deleteExpense, updateExpense, setUserBudget, deleteUserBudget } from '../../requests/expensesRequests.js'
import type { ClientExpense, AddBody, UpdateBody } from '@expense-tracker/shared'
import { useAuth } from '../authContext.jsx'
import {Button} from '../components/styling comps/Button.jsx'



export function ExpenseTrackerPage() {

    const [error, setError] = useState<string>('')
    const [expenses, setExpenses] = useState<ClientExpense[]>([])
    const [filter, setFilter] = useState<string>('all')
    const isFiltered: boolean = filter !== 'all'
    const filteredExpenses: ClientExpense[] = isFiltered ? expenses.filter(e => e.category === filter) : expenses
    const [showBudget, setShowBudget] = useState<boolean>(false)
    const {t, language} = useLanguage()
    const { user, updateUser, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        getExpenses().then(expenses => setExpenses(expenses)).catch(err => setError(err.message || 'Failed to load expenses'))
    }, [user])

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
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleAddExpense = async ({ name, amount, category }: AddBody) => {
        setError('')
        try {
            const res = await addExpense({ name, amount, category })
            setExpenses(prev => [...prev, res])
        } catch (err: any) {
            setError(err.message)

        }
    }

    const handleUpdateExpense = async (expenseId: number, updates: UpdateBody) => {
        setError('')
        try {
            const updatedExpense = await updateExpense(updates, expenseId)
            setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e))
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleAddBudget = async (value: number) => {
        if (!user) return
        try {
            const budget = await setUserBudget(value)
            updateUser({ ...user, budget })
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleDeleteBudget = async () => {
        if (!user) return
        try {
            const success = await deleteUserBudget()
            if (!success) return
            updateUser({ ...user, budget: null })
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
    const categoryPercentage = totalExpense !== 0 ? Math.floor((totalCategory * 100) / totalExpense ) : 0

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

            {showBudget && <Budget total={totalExpense} user={user!} onSetBudget={handleAddBudget} onDeleteBudget={handleDeleteBudget} />}

            {expenses.length !== 0 && <Filter expenses={expenses} filter={filter} setFilter={setFilter} />}

            <ExpensesList expenses={filteredExpenses} onDelete={handleDeleteExpense} onUpdate={handleUpdateExpense} />

            {/* Total and Filtering Dashboard Box */}
            <div className='flex flex-col md:flex-row p-4 items-stretch md:items-center justify-center gap-4 md:gap-6 bg-blue-50/80 border border-blue-100 rounded-lg text-sm md:text-base shadow-sm w-max max-w-full mx-auto font-medium text-blue-900'>

                {/* 1. Global Total */}
                <div className='flex flex-col md:flex-row md:items-center justify-center text-center md:text-left gap-0.5 md:gap-2 w-full md:w-auto'>
                    <span className='text-xs md:text-sm uppercase tracking-wider md:normal-case md:tracking-normal text-blue-700 md:text-blue-900'>{t('total')}: </span>
                    <span className='font-bold text-base md:text-lg text-black'>{totalExpense.toFixed(2) as unknown as number} &euro;</span>
                </div>
                {isFiltered && (
                    <>
                        <span className="hidden md:inline text-blue-300">|</span>
                        <hr className="block md:hidden border-blue-100/70 my-0.5" />

                        {/* 2. Category Total */}
                        <div className='flex flex-col md:flex-row md:items-center justify-center text-center md:text-left gap-0.5 md:gap-2 w-full md:w-auto'>
                            <span className='text-xs md:text-sm uppercase tracking-wider md:normal-case md:tracking-normal text-blue-700 md:text-blue-900'>{language === 'it' ? `Totale ${t(filter as any)}` : `${t(filter as any)} Total`}: </span>
                            <span className='text-black font-bold text-base md:text-lg'>{totalCategory} &euro;</span>
                        </div>

                        <span className="hidden md:inline text-blue-300">|</span>
                        <hr className="block md:hidden border-blue-100/70 my-0.5" />

                        {/* 3. Percentage */}
                        <div className='flex flex-col md:flex-row md:items-center justify-center text-center md:text-left gap-0.5 md:gap-2 w-full md:w-auto'>
                            <span className='text-xs md:text-sm uppercase tracking-wider md:normal-case md:tracking-normal text-blue-700 md:text-blue-900'>{language === 'it' ? `% ${t(filter as any)} del totale` : `${t(filter as any)} % of total`}: </span>
                            <span className='text-black font-bold text-base md:text-lg'>{categoryPercentage} %</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
