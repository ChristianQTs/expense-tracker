import { useState } from 'react'
import { Button, inputStyle } from './styling comps/Button.jsx'
import { useLanguage } from '../language/LanguageContext.js'
import type { AuthenticatedUser } from '@expense-tracker/shared'

interface BudgetProps {
    total: number;
    user: AuthenticatedUser;
    onSetBudget: (budget: number, type: 'monthly' | 'quarterly' | 'yearly') => void;
    onDeleteBudget: (type: 'monthly' | 'quarterly' | 'yearly') => void;
    expensePeriod: 'monthly' | 'quarterly' | 'yearly' | 'all'
}

const periodWeights = {
    monthly: 1,
    quarterly: 2,
    yearly: 3,
    all: 4
}
export function Budget({ total, user, onSetBudget, onDeleteBudget, expensePeriod }: BudgetProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [budgetInput, setBudgetInput] = useState(0)
    const [budgetType, setBudgetType] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')
    const { t } = useLanguage()
    const budget = budgetType === 'monthly' ? Number(user.monthly_budget || 0) : budgetType === 'quarterly' ? Number(user.quarterly_budget || 0) : Number(user.yearly_budget || 0);
    const canCalculateBudget = periodWeights[budgetType] >= periodWeights[expensePeriod]


    const handleAdd = async () => {
        if (!budgetInput || budgetInput <= 0 || !budgetType) return
        await onSetBudget(budgetInput, budgetType)
        setBudgetInput(0)
        setIsEditing(false)
    }

    const handleDelete = async () => {

        await onDeleteBudget(budgetType)
    }

    const budgetPercentage = total > 0 ? Math.floor(total * 100 / budget) : 0
    const remaining = budget - total

    return (
        <div className='bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-2xl w-full mx-auto flex flex-col gap-5 items-center my-4'>

            <div className='flex flex-col items-center gap-2 w-full'>
                <p className='text-gray-600 font-medium text-m'>{t('selectBudgetTypeLabel')}: </p>
                <div className='flex gap-3 md:gap-12 justify-center py-1'>
                    <button
                        type="button"
                        onClick={() => setBudgetType('monthly')}
                        className={`hover:scale-110 duration-200 cursor-pointer border-2 border-cyan-600 border-solid rounded-sm px-6 font-semibold ${budgetType === 'monthly' ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600'}`}
                    >
                        {t('month')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setBudgetType('quarterly')}
                        className={`hover:scale-110 duration-200 cursor-pointer border-2 border-cyan-600 border-solid rounded-sm px-6 font-semibold ${budgetType === 'quarterly' ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600'}`}
                    >
                        {t('quarter')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setBudgetType('yearly')}
                        className={`hover:scale-110 duration-200 cursor-pointer border-2 border-cyan-600 border-solid rounded-sm px-6 font-semibold ${budgetType === 'yearly' ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600'}`}
                    >
                        {t('year')}
                    </button>
                </div>
            </div>

            {budget > 0 ? (
                <div className='flex flex-wrap items-center justify-center gap-3 p-3 bg-blue-50/80 border border-blue-100 rounded-lg text-sm md:text-base font-medium text-blue-900 shadow-sm w-full md:w-auto'>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { setBudgetInput(budget); setIsEditing(true); }}
                            className="text-gray-400 hover:text-cyan-600 transition-colors ml-1 cursor-pointer hover:scale-105"
                            title="Edit Budget"
                            type="button"
                        >
                            ✏
                        </button>
                        <span>{budgetType === 'monthly' ? t('monthlyBudget') : budgetType === 'quarterly' ? t('quarterlyBudget') : t('yearlyBudget')}: <strong>{budget} &euro;</strong></span>

                        <Button onClick={handleDelete} title='Delete this budget' styleType='delete' className="grid place-items-center h-5 w-5 !p-0 text-xs rounded-full hover:scale-105">
                            X
                        </Button>
                    </div>

                    
                    {canCalculateBudget ?
                        (
                            <>
                                <span className={remaining >= 0 ? 'text-emerald-700' : 'text-red-600 font-bold'}>
                                    {remaining >= 0 ? t('remaining') : t('overspent')}: {Math.abs(remaining).toFixed(2)} &euro;
                                </span>
                                

                                <span className={budgetPercentage >= 80 ? 'text-red-600 font-bold animate-pulse' : 'text-blue-700'}>
                                    {budgetPercentage}% {t('spent')}
                                </span>
                            </>
                        ) : (
                            <>
                                
                                <span className="text-gray-500 italic text-[14px] ">
                                    {t('periodComparisonWarning') }
                                </span>
                            </>
                        )}
                </div>
            ) : (
                <div className='flex flex-col gap-3 items-center justify-center py-2'>
                    <p className='text-gray-500 font-medium text-sm text-center'>
                        {budgetType === 'monthly' ? t('noMonthlyBudgetYetLabel') : budgetType === 'quarterly' ? t('noQuarterlyBudgetYetLabel') : t('noYearlyBudgetYetLabel')}.
                    </p>
                    <Button
                        type="button"
                        className="px-5 py-2 text-sm font-semibold"
                        onClick={() => { setBudgetInput(0); setIsEditing(true); }}
                    >
                        {t('setBudgetNow')}
                    </Button>
                </div>
            )}
            {/* Budget edit pop-up: */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 max-w-md w-full mx-4 flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="font-bold text-gray-800 capitalize">
                                {budgetType === 'monthly' ? t('monthlyBudget') : budgetType === 'quarterly' ? t('quarterlyBudget') : t('yearlyBudget')}
                            </h3>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="flex flex-col gap-4">
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-gray-700 font-medium text-sm' htmlFor='popup-budget'>
                                    {t('setBudgetLabel')}:
                                </label>
                                <input
                                    className={`${inputStyle} w-full`}
                                    id='popup-budget'
                                    type='number'
                                    autoFocus
                                    value={budgetInput === 0 ? '' : budgetInput}
                                    onChange={e => setBudgetInput(Number(e.target.value))}
                                />
                            </div>

                            <div className='flex justify-end gap-2 mt-2'>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-sm font-medium transition-colors cursor-pointer"
                                >
                                    {t('cancel')}
                                </button>
                                <Button
                                    type="submit"
                                    className="px-4 py-2 text-sm"
                                    isDisabled={!budgetInput || budgetInput <= 0}
                                >
                                    {t('setBudgetButton')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}