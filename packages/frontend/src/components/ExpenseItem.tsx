import { useState } from 'react'
import { Button, inputStyle } from './styling comps/Button.jsx'
import {useLanguage} from '../language/LanguageContext.js'

import type { ClientExpense, UpdateBody } from '@expense-tracker/shared'

interface ExpenseItemProps {
    expense: ClientExpense;
    onDelete: (id: number) => void;
    onUpdate: (id: number, data: UpdateBody) => void;
}


export function ExpenseItem({ expense , onDelete, onUpdate } : ExpenseItemProps) {
    const categories = ['Housing','Transportation','Food','Utilities','Clothing','Medical','Insurance','Household Supplies','Personal','Debt','Retirement','Savings','Gifts','Entertainment']
    const {t} = useLanguage()
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editedName, setEditedName] = useState<string>(expense.name)
    const [editedAmount, setEditedAmount] = useState<number>(expense.amount)
    const [editedCategory, setEditedCategory] =useState<string>(expense.category)

    const handleSave = () => {
        onUpdate(expense.id, {
            name: editedName,
            amount: editedAmount,
            category:editedCategory
        })
        setIsEditing(false)
    }

    const toggleEditing = () => {
        setIsEditing(prev => !prev)
        if (isEditing) {
            setEditedName(expense.name)
            setEditedAmount(expense.amount)
            setEditedCategory(expense.category)
        }
    }
    const hasChanges = expense.name !== editedName.trim() || Number(expense.amount) !== Number(editedAmount)|| expense.category !== editedCategory
    const isValid = editedName.trim() !== '' && editedAmount !== null && editedAmount > 0 && editedCategory.trim() !== '';
    
    const gridLayout = "grid grid-cols-[100px_1fr_100px] items-center px-2 py-2 w-full text-center";

    return (

        (!isEditing) ?
            (
                <li className={gridLayout}>
                    <div className='justify-self-start'>
                        <Button  onClick={() => setIsEditing(prev => !prev)}>{isEditing ? t('closeEdit') : t('edit')}</Button>
                    </div>
                    <div className='flex flex-wrap items-center justify-center gap-x-3 text-sm tracking-wide'>
                        <span className='font-semibold text-gray-800 text-base min-w-[100px]'>{expense.name} </span>
                        <span className='hidden md:inline text-gray-300 font-light'>|</span>
                        <span className='font-mono font-medium px-0.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 min-w-[75px]'>{expense.amount}  &euro; </span>
                        <span className='hidden md:inline text-gray-300 font-light'>|</span>
                        <span className='text-xs font-medium uppercase px-0.5 py-1 bg-gray-100 text-gray-600 rounded-full'>{t(expense.category as any)} </span>
                        <span className='hidden md:inline text-gray-300 font-light'>|</span>
                        <span className='text-xs text-gray-400 font-mono tracking-tight bg-gray-50 px-0.5 py-1 rounded'>{String(expense.created_at).split('T')[0]}</span>
                    </div>
                    <div className='justify-self-end'>
                        <Button onClick={() => onDelete(expense.id)} styleType='delete' title='Delete'>X</Button>
                    </div>
                </li>
            ) :
            (
                <li className={`${gridLayout} bg-inherit border border-dashed border-gray-200 rounded`}>
                    <div className='justify-self-start'>
                        <Button onClick={toggleEditing}>{isEditing ? t('closeEdit') : t('edit')}</Button>
                    </div>
                    <div className='flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm'>
                        <input className={`${inputStyle} w-36  py-1 text-center font-medium border-gray-300 focus:border-blue-400 shadow-sm`} type='text' value={editedName} onChange={e => setEditedName(e.target.value)} />
                        <div className="flex flex-wrap items-center relative">
                            <input className={`${inputStyle} w-24 py-1 text-right font-mono font-medium border-gray-300 focus:border-emerald-400 shadow-sm`} type='number' value={editedAmount === 0?'':editedAmount} onChange={e => setEditedAmount(Number(e.target.value))} />
                            <span className='justify-self-start text-gray-400 font-medium'> &euro;</span>
                        </div>
                        <select className={`${inputStyle}  py-1 font-medium text-gray-700 bg-white border-gray-300 focus:border-blue-400 shadow-sm cursor-pointer`} value={editedCategory} onChange={e => setEditedCategory(e.target.value)}>                      
                        {
                            categories.map(c =><option key={c} value={c}>{t(c as any)}</option>)
                        }

                        </select>
                    </div>
                    <div className='justify-self-end'>
                        <Button onClick={handleSave} isDisabled={!hasChanges || !isValid}>{t('save')}</Button>
                    </div>
                </li>
        )
    )
}