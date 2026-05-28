import { useState } from 'react'
import { Button, inputStyle } from './styling comps/Button.jsx'
import type { AuthenticatedUser } from '@expense-tracker/shared'

interface BudgetProps {
    total: number;
    user: AuthenticatedUser;
    onSetBudget: (budget: number) => void;
    onDeleteBudget: (id: number) => void;
}
export function Budget({ total, user, onSetBudget, onDeleteBudget } : BudgetProps) {

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

    const budgetPercentage = total > 0 ? Math.floor(total * 100 /budget) : 0
    const remaining = budget - total

    return (
        <div className='flex items-center justify-center gap-2.5'>
            <div>
                <label htmlFor='budget'>Set a monthly budget: </label>
                <input className={inputStyle} id='budget' type='number' value={budgetInput === 0? '':budgetInput} onChange={e => setBudgetInput (Number(e.target.value)) } />
                <Button onClick={handleAdd} isDisabled={!budgetInput || budgetInput <= 0}>Set budget</Button>
            </div>
            {budget &&
                <div style={{ background: '#e9eaec' }}>
                    <span>Monthly budget: {budget} &euro;</span>
                    <Button onClick={handleDelete} styleType='delete'>X</Button>
                    <span> - {remaining >= 0 ? 'Remaining' : 'Overspent'} {remaining} &euro; - </span>
                    <span style={{ color: budgetPercentage >= 80 ? "#dc2626" : "inherit", fontWeight: budgetPercentage >= 80 ? 'bold' : 'normal', }}> {budgetPercentage} % spent</span>
                </div>
            }
        </div>
    )
}