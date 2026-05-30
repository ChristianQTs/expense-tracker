import { useState } from 'react'
import type { AddBody } from '@expense-tracker/shared'
import { Button, inputStyle } from './styling comps/Button.jsx'
interface addExpenseProps {
    onAdd: (data: AddBody) => void;
    children:any
}

export function AddExpense({ onAdd, children }:addExpenseProps) {

    const [nameInput, setNameInput] = useState<string>('')
    const [amountInput, setAmountInput] = useState<number>()
    const [categoryInput, setCategoryInput] = useState<string>('')

    const handleAdd = (e:any) => {
        e.preventDefault()
        if (!nameInput || !amountInput || !categoryInput) {
            window.alert('Please select all fields.')
            return
        }
        onAdd({name:nameInput, amount:amountInput, category:categoryInput})
        setNameInput('')
        setAmountInput(0)
        setCategoryInput('')

    }

    return (
        <div className='py-6'>
            <form className='flex flex-col md:flex-row md:flex-wrap gap-4 w-full items-end' onSubmit={handleAdd}>
                <div className='flex items-center gap-2 w-full md:w-auto'>
                    <label className='px-1 w-20 shrink-0 md:w-auto' htmlFor='name'>Name: </label>
                    <input className={inputStyle} id='name' name='name' type='text' value={nameInput} onChange={e => setNameInput(e.target.value)} />
                </div>
                <div className='flex items-center gap-2 w-full md:w-auto'>
                    <label className='px-1 w-20 shrink-0 md:w-auto' htmlFor='amount'>Amount: </label>
                    <input className={inputStyle} id='amount' name='amount' type='number' value={amountInput === 0 ? '' : amountInput} onChange={e => setAmountInput(Number(e.target.value))} />
                </div>
                <div className='flex items-center gap-2 w-full md:w-auto'>
                    <label className='px-1 w-20 shrink-0 md:w-auto' htmlFor='category'>Category: </label>
                    <select className={inputStyle} id='category' name='category' value={categoryInput} onChange={e => setCategoryInput(e.target.value)}>
                        <option value=''>Category</option>
                        <option value='Housing'>Housing</option>
                        <option value='Transportation'>Transportation</option>
                        <option value='Food'>Food</option>
                        <option value='Utilities'>Utilities</option>
                        <option value='Clothing'>Clothing</option>
                        <option value='Medical'>Medical</option>
                        <option value='Insurance'>Insurance</option>
                        <option value='Household Supplies'>Household Supplies</option>
                        <option value='Personal'>Personal</option>
                        <option value='Debt'>Debt</option>
                        <option value='Retirement'>Retirement</option>
                        <option value='Education'>Education</option>
                        <option value='Savings'>Savings</option>
                        <option value='Gifts'>Gifts</option>
                        <option value='Entertainment'>Entertainment</option>
                    </select>
                </div>
                <div className='flex items-end gap-2 w-full md:w-auto mt-2 md:mt-0'>
                    <Button
                        className='flex-1 md:w-auto max-md:px-2 max-md:py-0.5 max-md:text-s max-md:font-medium'
                        title='Add new expense'
                        type="submit"
                        isDisabled={!nameInput || !amountInput || !categoryInput || amountInput <= 0}
                    >
                        Add
                    </Button>
                    {children}
                </div>
            </form>
        </div>
    )
}