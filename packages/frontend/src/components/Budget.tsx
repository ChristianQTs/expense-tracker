import { useState } from 'react'
import { Button, inputStyle } from './styling comps/Button.jsx'
import type { AuthenticatedUser } from '@expense-tracker/shared'

interface BudgetProps {
    total: number;
    user: AuthenticatedUser;
    onSetBudget: (budget: number) => void;
    onDeleteBudget: (id: number) => void;
}
export function Budget({ total, user, onSetBudget, onDeleteBudget }: BudgetProps) {

    const [budgetInput, setBudgetInput] = useState(0)
    const budget = user.budget!
    const handleAdd = async () => {

        if (!budgetInput || budgetInput <= 0) return
        await onSetBudget(budgetInput)
        setBudgetInput(0)

    }

    const handleDelete = async () => {

        await onDeleteBudget(user.id)
    }

    const budgetPercentage = total > 0 ? Math.floor(total * 100 / budget) : 0
    const remaining = budget - total

    return (
        <div className='p-3 w-full flex flex-col gap-6 items-center'>

            <form
                className='flex flex-col md:flex-row md:flex-wrap gap-4 w-full justify-center items-end'
                onSubmit={(e) => { e.preventDefault(); handleAdd(); }}
            >
                <div className='flex items-center gap-2 w-full md:w-auto'>

                    <label className='w-44 shrink-0 md:w-auto text-gray-700 font-medium' htmlFor='budget'>
                        Set a monthly budget:
                    </label>
                    <input
                        className={`${inputStyle} flex-1`}
                        id='budget'
                        type='number'
                        value={budgetInput === 0 ? '' : budgetInput}
                        onChange={e => setBudgetInput(Number(e.target.value))}
                    />
                </div>
                <div className='w-full flex justify-center md:w-auto'>
                    <Button
                        type="button"
                        onClick={handleAdd}
                        className="w-auto h-fit whitespace-nowrap max-md:px-3 max-md:py-1 max-md:text-s max-md:font-medium"
                        isDisabled={!budgetInput || budgetInput <= 0}
                    >
                        Set budget
                    </Button>
                </div>
            </form>

            {budget && (

                <div className='flex flex-wrap items-center justify-center gap-3 p-3 bg-blue-50/80 border border-blue-100 rounded-lg text-sm md:text-base font-medium text-blue-900 shadow-sm w-full md:w-auto'>

                    <div className="flex items-center gap-2">
                        <span>Monthly budget: <strong>{budget} &euro;</strong></span>

                        <Button onClick={handleDelete} styleType='delete' className="grid place-items-center h-5 w-5 !p-0 text-xs rounded-full">
                            X
                        </Button>
                    </div>

                    <span className="hidden md:inline text-blue-300">|</span>

                    <span className={remaining >= 0 ? 'text-emerald-700' : 'text-red-600 font-bold'}>
                        {remaining >= 0 ? 'Remaining:' : 'Overspent:'} {Math.abs(remaining).toFixed(2)} &euro;
                    </span>

                    <span className="hidden md:inline text-blue-300">|</span>

                    <span className={budgetPercentage >= 80 ? 'text-red-600 font-bold animate-pulse' : 'text-blue-700'}>
                        {budgetPercentage}% spent
                    </span>

                </div>
            )}
        </div>
    )
}