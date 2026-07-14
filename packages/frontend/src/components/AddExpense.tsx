import { useState } from 'react'
import type { AddBody } from '@expense-tracker/shared'
import { Button, inputStyle } from './styling comps/Button.jsx'
import { useLanguage } from '../language/LanguageContext.js'
interface addExpenseProps {
    onAdd: (data: AddBody) => void;
    children:any
}

export function AddExpense({ onAdd, children }:addExpenseProps) {

    const [nameInput, setNameInput] = useState<string>('')
    const [amountInput, setAmountInput] = useState<number>()
    const [categoryInput, setCategoryInput] = useState<string>('')
    const {t} = useLanguage()

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
            <form className='flex flex-col md:flex-row md:flex-wrap gap-4 w-max items-end bg-blue-80/50 shadow-md border-blue-100 p-3 font-medium' onSubmit={handleAdd}>
                <div className='flex items-center gap-2 w-full md:w-auto'>
                    <label className='px-1 w-20 shrink-0 md:w-auto' htmlFor='name'>{t('name') }: </label>
                    <input className={inputStyle} id='name' name='name' type='text' value={nameInput} onChange={e => setNameInput(e.target.value)} />
                </div>
                <div className='flex items-center gap-2 w-full md:w-auto'>
                    <label className='px-1 w-20 shrink-0 md:w-auto' htmlFor='amount'>{t('amount') }: </label>
                    <input className={inputStyle} id='amount' name='amount' type='number' value={amountInput === 0 ? '' : amountInput} onChange={e => setAmountInput(Number(e.target.value))} />
                </div>
                <div className='flex items-center gap-2 w-full md:w-auto'>
                    <label className='px-1 w-20 shrink-0 md:w-auto' htmlFor='category'>{t('category') }: </label>
                    <select className={`${inputStyle} w-full md:w-auto`} id='category' name='category' value={categoryInput} onChange={e => setCategoryInput(e.target.value)}>
                        <option value=''>{t('category')}</option>
                        <option value='Housing'>{t('Housing')}</option>
                        <option value='Transportation'>{t('Transportation')}</option>
                        <option value='Food'>{t('Food')}</option>
                        <option value='Utilities'>{t('Utilities')}</option>
                        <option value='Clothing'>{t('Clothing')}</option>
                        <option value='Medical'>{t('Medical')}</option>
                        <option value='Insurance'>{t('Insurance')}</option>
                        <option value='Household Supplies'>{t('Household Supplies')}</option>
                        <option value='Personal'>{t('Personal')}</option>
                        <option value='Debt'>{t('Debt')}</option>
                        <option value='Retirement'>{t('Retirement')}</option>
                        <option value='Education'>{t('Education')}</option>
                        <option value='Savings'>{t('Savings')}</option>
                        <option value='Gifts'>{t('Gifts')}</option>
                        <option value='Entertainment'>{t('Entertainment')}</option>
                        <option value='Taxes'>{t('Taxes')}</option>
                        <option value='Fees'>{t('Fees')}</option>
                    </select>
                </div>
                <div className='flex items-end gap-2 w-full md:w-auto mt-2 md:mt-0'>
                    <Button
                        className='flex-1 md:w-auto max-md:px-2 max-md:py-0.5 max-md:text-s max-md:font-medium'
                        title='Add new expense'
                        type="submit"
                        isDisabled={!nameInput || !amountInput || !categoryInput || amountInput <= 0}
                    >
                        {t('add')}
                    </Button>
                    {children}
                </div>
            </form>
        </div>
    )
}