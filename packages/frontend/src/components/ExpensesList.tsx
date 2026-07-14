import { ExpenseItem } from './ExpenseItem.jsx'
import type { ClientExpense, UpdateBody } from '@expense-tracker/shared'
import { useLanguage } from '../language/LanguageContext.js'
interface ListProps {
    expenses: ClientExpense[];
    onDelete: (id:number) => void;
    onUpdate: (id: number, data: UpdateBody) => void;
    period: 'monthly' | 'quarterly' | 'yearly' | 'all'
}
export function ExpensesList({ expenses, onDelete, onUpdate, period }: ListProps) { 

    const {t} = useLanguage()

    return (expenses.length === 0 ? (<h3 className='font-bold text-xl text-center p-6'>{period === 'monthly' ? t('noMonthExpense') : period === 'quarterly' ? t('noQuarterExpense') : period === 'yearly' ? t('noYearExpense') : t('noExpenseYet')}.</h3>) :      
        (
            <div className="flex flex-wrap items-center justify-center gap-2.5 bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-2xl w-full mx-auto flex flex-col gap-5 my-4">
                <ul className="divide-y w-full max-w-[700px]">
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