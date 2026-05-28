import { ExpenseItem } from './ExpenseItem.jsx'
import type { ClientExpense, UpdateBody } from '@expense-tracker/shared'
interface ListProps {
    expenses: ClientExpense[];
    onDelete: (id:number) => void;
    onUpdate: (id:number, data:UpdateBody) => void;
}
export function ExpensesList({ expenses, onDelete, onUpdate }: ListProps) { 

    return (expenses.length === 0 ? (<h3 className='font-bold text-xl text-center p-6'>No expense Yet</h3>) :      
        (
            <div className="flex items-center justify-center gap-2.5">
                <ul className="divide-y w-[700px]">
            {
                expenses.map((e) =>
                    <ExpenseItem
                        key={e.id}
                        expense={e}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                    />
                )
            }
                </ul>
            </div>
    ))
    
        
    
}