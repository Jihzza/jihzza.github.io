// src/components/scheduling/consultations/CustomCalendar.jsx

import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
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
    // --- STATE MANAGEMENT ---
    // This state is internal to the calendar and only tracks the currently *viewed* month.
    // The actual *selected date* state is managed by the parent component.
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // --- HANDLERS ---
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    // --- RENDER LOGIC: HEADER ---
    // This section renders the month/year title and the navigation arrows.
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

    // --- RENDER LOGIC: DAYS OF THE WEEK ---
    // This renders the "Sun, Mon, Tue..." header row.
    const renderDays = () => {
        const days = [];
        const date = startOfWeek(currentMonth); // Start from Sunday of the current month's week.

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center text-sm font-medium text-gray-400">
                    {format(addDays(date, i), 'E')}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mt-4">{days}</div>;
    };

    // --- RENDER LOGIC: CALENDAR CELLS ---
    // This is the core logic for rendering the grid of days.
    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day; // Important for the onClick handler closure.

                // --- DYNAMIC STYLING LOGIC ---
                // We build the `className` string dynamically based on the day's state.
                const cellClasses = [
                    'h-7', 'w-7', 'flex', 'items-center', 'justify-center',
                    'rounded-lg', 'border', 'cursor-pointer', 'transition-colors', 'duration-200', 'text-sm'
                ];

                if (!isSameMonth(day, monthStart)) {
                    // Day is not in the current month.
                    cellClasses.push('text-gray-500', 'border-transparent');
                } else if (isSameDay(day, selectedDate)) {
                    // Day is the selected day.
                    cellClasses.push('bg-transparent', 'border-[#BFA200]', 'border-2', 'font-bold', 'text-white', 'scale-105');
                } else {
                    // Day is in the current month but not selected.
                    cellClasses.push('text-white', 'border-gray-600', 'hover:bg-gray-700');
                }

                days.push(
                    <div
                        key={day.toString()}
                        className={cellClasses.join(' ')}
                        onClick={() => onDateSelect(cloneDay)}
                    >
                        <span>{formattedDate}</span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-2" key={day.toString()}>
                    {days}
                </div>
            );
            days = []; // Reset for the next row.
        }
        return <div className="space-y-2 mt-2">{rows}</div>;
    };


    // --- FINAL COMPONENT RENDER ---
    return (
        <div className="w-full max-w-md mx-auto rounded-lg bg-[#002147]">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
}