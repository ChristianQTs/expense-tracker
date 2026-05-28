import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddExpense } from '../components/AddExpense.jsx'
import { ExpensesList } from '../components/ExpensesList.jsx'
import { Filter } from '../components/Filter.jsx'
import { Budget } from '../components/Budget.jsx'
import { getExpenses, addExpense, deleteExpense, updateExpense, setUserBudget, deleteUserBudget } from '../../requests/expensesRequests.js'
import type { ClientExpense, AddBody, UpdateBody } from '@expense-tracker/shared'
import { AuthContext } from '../authContext.jsx'
import {Button} from '../components/styling comps/Button.jsx'
export function ExpenseTrackerPage() {

    const [error, setError] = useState<string>('')
    const [expenses, setExpenses] = useState<ClientExpense[]>([])
    const [filter, setFilter] = useState<string>('all')
    const isFiltered:boolean = filter !== 'all'
    const filteredExpenses : ClientExpense[]= isFiltered ? expenses.filter(e => e.category === filter) : expenses
    const [showBudget, setShowBudget] = useState<boolean>(false)
    const { user, updateUser, logout } = useContext(AuthContext)! 
    const navigate = useNavigate() 

    useEffect(() => {
        if(!user) return setExpenses([])
        getExpenses().then(expenses => { setExpenses(expenses) }).catch(err => console.error(err))
    }, [user])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (isFiltered && filteredExpenses.length === 0) setFilter('all')
    }, [filteredExpenses, isFiltered])
    

    const handleDeleteExpense = (id:number) => {
        deleteExpense(id).then(expenseId => {
            if (!expenseId) return
            setExpenses(prev => prev.filter(e => e.id !== expenseId))
        })
    }

    const handleAddExpense = async ({ name, amount, category } : AddBody) => {
        setError('')
        try {
            const res = await addExpense({ name, amount, category })
            setExpenses(prev => [...prev, res])
        } catch (err :any) {
            setError(err.message)

        }
    }

    const handleUpdateExpense = (expenseId : number, updates : UpdateBody) => {
        setError('')
        updateExpense(updates, expenseId).then(updatedExpense => {
            if (!updatedExpense) return
            setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e))
        })
    }

    const handleAddBudget = (value: number) => {
        if(!user) return
        setUserBudget(value).then(budget => {
            updateUser({...user, budget})
        })
    }

    const handleDeleteBudget = () => {
        if(!user) return
        deleteUserBudget().then(success => {
            if(!success) return
            updateUser({...user, budget:null})
        })
    }

    const handleLogout = async() => {
        if(!user) return
        await logout()
        navigate('/login')
    }

    const totalExpense = expenses.length !== 0 ? expenses.reduce((tot, exp) => tot + Number(exp.amount), 0) : 0
    const totalCategory = expenses.length !== 0 ? filteredExpenses.reduce((tot, exp) => tot + Number(exp.amount), 0) : 0
    const categoryPercentage = totalExpense !== 0 ? Math.floor((totalCategory * 100) / totalExpense) : 0

    return (
        <div className='min-h-screen bg-mist-100 flex flex-col '>
            <h1 className='px-5 py-7 flex justify-center text-black text-4xl font-bold'>Expenses Tracker</h1>
            <div className='flex items-center justify-center gap-2.5'>
                <h2>Welcome <strong>{user?.username}</strong>!</h2>
                <Button onClick={handleLogout} styleType='auth'>Log out</Button>
            </div>
            <div>
                <div className='flex items-center justify-center gap-2.5'>
                    <AddExpense onAdd={handleAddExpense} />
                    <Button onClick={() => setShowBudget(prev => !prev)}>{`${showBudget ? 'Hide' : 'Show'} Budget Options`}</Button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {error && <Button onClick={() => setError('')}>Ok</Button>}
                </div>
                    {showBudget && <Budget total={totalExpense} user={user!} onSetBudget={handleAddBudget} onDeleteBudget={handleDeleteBudget} />}
                {(expenses.length !== 0 && <Filter expenses={expenses} filter={filter} setFilter={setFilter} />)}
                    <ExpensesList expenses={filteredExpenses} onDelete={handleDeleteExpense} onUpdate={handleUpdateExpense} />
                <section className='flex items-center justify-center gap-2.5 bg-mist-200'>
                    <span><strong>Total: </strong>{totalExpense} &euro;</span>
                    {(isFiltered && <span> - <strong>{filter} total: </strong>{totalCategory} &euro;</span>)}
                    {(isFiltered && <span> - <strong>{filter}</strong> % of total expenses: {categoryPercentage} %</span>) }
                </section>
                </div>              
        </div>
    )
}