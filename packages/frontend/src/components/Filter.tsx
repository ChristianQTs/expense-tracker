import { inputStyle } from './styling comps/Button.jsx'
import type { ClientExpense } from '@expense-tracker/shared'

interface FilterProps {
    expenses: ClientExpense[];
    filter: string;
    setFilter : (filter:string) => void
}
export function Filter({ expenses, filter, setFilter }: FilterProps) {

    const categories = [...new Set(expenses.map((e:any) => e.category))]
    return (
        <div className='flex items-center justify-center gap-2.5 py-5'>
            <label htmlFor='filter'>Filter: </label>
            <select className={ inputStyle } id='filter' name='filter' value={filter} onChange={e => setFilter(e.target.value)}>
            <option value='all'>All</option>
                {
                    categories.map((e:any) =>
                        <option key={e} value={e}>{e}</option>
                )}
            </select>

        </div>
    )
}