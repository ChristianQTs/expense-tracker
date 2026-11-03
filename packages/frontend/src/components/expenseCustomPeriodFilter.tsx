import { useState } from 'react';
import { useLanguage } from '../language/LanguageContext.js'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ExpenseDateFilterProps {
    onApplyFilter: (startDate: Date, endDate: Date) => void;
    onClearFilter?: () => void;
}

export function ExpenseDateFilter({ onApplyFilter, onClearFilter }: ExpenseDateFilterProps) {

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;
    const {t,language} = useLanguage()

    const handleSetClick = () => {

        if (startDate && endDate) {

            const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setHours(23, 59, 59, 999);

            onApplyFilter(startDate, adjustedEndDate);
        }
    };

    const handleClear = () => {
        setDateRange([null, null]);
        if (onClearFilter) onClearFilter();
    };

    return (
        <div className="flex flex-nowrap text-s items-end gap-1 p-1.5 bg-gray-100 rounded-lg border border-gray-200">
            <div className="flex min-w-0 flex-col">
                <label className="mb-1 whitespace-nowrap items-center font-semibold text-gray-700">
                    {t('customPeriod')}
                </label>
                <DatePicker

                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update: [Date | null, Date | null]) => {
                        setDateRange(update);
                    }}
                    isClearable={true}
                    placeholderText={t('selectStartEndDateExpenses')}
                    dateFormat={language === 'en' ? "MMM d, yyyy": "d MMM, yyyy"}
                    className="w-44 sm:w-48 px-2 py-1.5 border border-gray-300 rounded-md text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
            </div>

            <button
                onClick={handleSetClick}
                disabled={!startDate || !endDate}
                className="shrink-0 whitespace-nowrap px-1.5 py-1.5 bg-blue-700 text-white text-xs font-semibold rounded-md hover:bg-blue-900 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {t('setPeriod')}
            </button>

            {(startDate || endDate) && (
                <button
                    onClick={handleClear}
                    className="shrink-0 whitespace-nowrap px-1 py-1.5 text-xs text-gray-600 hover:text-red-600 font-medium transition"
                >
                    {t('resetPeriod')}
                </button>
            )}
        </div>
    );
}