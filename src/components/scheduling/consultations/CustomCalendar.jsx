// src/components/scheduling/consultations/CustomCalendar.jsx

import React, { useState } from 'react';
// Add isSaturday and isSunday from date-fns
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isSaturday, isSunday } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

/**
 * A from-scratch, reusable calendar component for selecting a date.
 * It is a "controlled" component, receiving its state and handlers via props.
 * This gives the parent component full control over the calendar's behavior.
 *
 * @param {Date | null} selectedDate - The currently selected date from the parent component.
 * @param {function(Date): void} onDateSelect - The callback function to execute when a date is selected.
 */
export default function CustomCalendar({ selectedDate, onDateSelect }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const renderHeader = () => (
        <div className="flex justify-between items-center py-2 px-1">
            <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                <ChevronLeftIcon className="h-5 w-5 text-white" />
            </button>
            <h2 className="font-bold text-lg text-white">
                {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                <ChevronRightIcon className="h-5 w-5 text-white" />
            </button>
        </div>
    );

    const renderDays = () => {
        const days = [];
        const date = startOfWeek(currentMonth);
        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center text-sm font-medium text-gray-400">
                    {format(addDays(date, i), 'E')}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mt-4">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                const isWeekend = isSaturday(cloneDay) || isSunday(cloneDay);

                const cellClasses = [
                    'h-7', 'w-7', 'flex', 'items-center', 'justify-center',
                    'rounded-lg', 'border', 'transition-colors', 'duration-200', 'text-sm'
                ];

                if (isWeekend) {
                    // --- CHANGE: WEEKEND STYLING ---
                    // "Why": Add styles to visually disable weekends and prevent clicks.
                    cellClasses.push('text-gray-600', 'border-transparent', 'cursor-not-allowed', 'line-through');
                } else if (!isSameMonth(day, monthStart)) {
                    cellClasses.push('text-gray-500', 'border-transparent');
                } else if (isSameDay(day, selectedDate)) {
                    cellClasses.push('bg-transparent', 'border-[#BFA200]', 'border-2', 'font-bold', 'text-white', 'scale-105');
                } else {
                    cellClasses.push('text-white', 'border-gray-600', 'hover:bg-gray-700', 'cursor-pointer');
                }

                days.push(
                    <div
                        key={day.toString()}
                        className={cellClasses.join(' ')}
                        // --- CHANGE: PREVENT WEEKEND SELECTION ---
                        // "Why": We only call onDateSelect if the day is not a weekend.
                        onClick={() => !isWeekend && onDateSelect(cloneDay)}
                    >
                        <span>{format(day, 'd')}</span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-2" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="space-y-2 mt-2">{rows}</div>;
    };

    return (
        <div className="w-full max-w-md mx-auto rounded-lg bg-[#002147]">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
}