import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ExpenseDateFilterProps {
    onApplyFilter: (startDate: Date, endDate: Date) => void;
    onClearFilter?: () => void;
}

export function ExpenseDateFilter({ onApplyFilter, onClearFilter }: ExpenseDateFilterProps) {

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;

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
        <div className="flex flex-wrap items-end gap-3 p-4 bg-gray-100 rounded-lg border border-gray-200">
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold text-gray-700">
                    Filter Period
                </label>
                <DatePicker

                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update: [Date | null, Date | null]) => {
                        setDateRange(update);
                    }}
                    isClearable={true}
                    placeholderText="Select start & end dates"
                    dateFormat="MMM d, yyyy"
                    className="p-2 border border-gray-300 rounded-md text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 cursor-pointer"
                />
            </div>

            <button
                onClick={handleSetClick}
                disabled={!startDate || !endDate}
                className="px-4 py-2 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-900 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Set
            </button>

            {(startDate || endDate) && (
                <button
                    onClick={handleClear}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 font-medium transition"
                >
                    Reset
                </button>
            )}
        </div>
    );
}