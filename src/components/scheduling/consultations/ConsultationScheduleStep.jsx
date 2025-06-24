// src/components/scheduling/consultations/ConsultationScheduleStep.jsx

import React, { useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // imports the default styling. We can override this with Tailwind
import { format, set, isBefore, startOfToday, getDay } from 'date-fns';

// UTILITY DATA & FUNCTIONS
// These are defined outside the component for clarity and performance

// Duration options in minutes
const durationOptions = [
    { label: '45 min', value: 45 },
    { label: '1 hour', value: 60 },
    { label: '1h 15min', value: 75 },
    { label: '1h 30min', value: 90 },
    { label: '1h 45min', value: 105 },
    { label: '2 hours', value: 120 },
];

/**
 * Generates available time s<<lots for a given date and duration
 * @param {Date} selectedDate - The date the user has picked.
 * @param {number} durationInMinutes - The duration of the consultation
 * @returns {string[]} An array of formatted time slots (e.g., "10:15")
 */

const generateTimeSlots = (selectedDate, durationInMinutes) => {
    if (!selectedDate || !durationInMinutes) return [];

    const slots = [];
    const now = new Date();

    // Set the start of our workday on the selected date
    let slotTime = set(selectedDate, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 });

    // Set the end of our workday on the selected date
    const workdayEnd = set(selectedDate, { hours: 22, minutes: 0, seconds: 0, milliseconds: 0 });

    while(true) {
        const finishTime = new Date(slotTime.getTime() + durationInMinutes * 60000);

        // Break the loop if the finish time of the current slot exceeds the workday end
        if (isBefore(workdayEnd, finishTime)) {
            break;
        }

        // Only add the slot if it's in the future (compared to the current time "now")
        if (isBefore(now, slotTime)) {
            slots.push(format(slotTime, 'HH:mm'));
        }

        // Move to the next 15-minute interval for the next potential slot
        slotTime = new Date(slotTime.getTime() + 15 * 60000);
    }

    return slots;
};

// COMPONENT DEFINITION

/**
 * @param {object} consultationData - An object containing the current state for { date, duration, time }
 * @param {function} onUpdateField - Callback to update the parent component's state
 */

export default function ConsultationScheduleStep({ consultationData, onUpdateField }) {
    // We use `useMemo` as a perfomance optimization
    // This ensures that the time slots are only recalculated when the selected date or duration changes, not on every single re-render of the component
    const availableTimes = useMemo(() => generateTimeSlots(consultationData.date, consultationData.duration), [consultationData.date, consultationData.duration]
    );

    // RENDER LOGIC
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Schedule your consultation</h2>
            <p className="text-center text-gray-500 mb-6">Select a date, duration, and time that works for you.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* CALENDAR SELECTION */}
                <div className="flex flex-col items-center">
                    <h3 className="font-semibold mb-2">Select a Date</h3>
                    <DayPicker
                        mode="single"
                        selected={consultationData.date}
                        onSelect={(date) => onUpdateField('date', date)}
                        // We disable past days and weekends (Saturday=6, Sunday=0)
                        disabled={[
                            { before: startOfToday() },
                            { dayOfWeek: [0, 6] }
                        ]}
                        // Custom styles to integrate with Tailwind.
                        className={{
                            root: 'bg-white p-3 rounded-lg border border-gray-200',
                            caption: 'flex justify-between items-center mb-2',
                            nav_button: 'h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100',
                            head_cell: 'w-10 h-10 text-sm font-semibold text-gray-500',
                            day: 'w-10 h-10 rounded-full hover:bg-indigo-100',
                            day_selected: 'bg-indigo-600 text-white font-bold hover:bg-indigo-600',
                            day_disabled: 'text-gray-300 cursor-not-allowed',
                            day_today: 'font-bold text-indigo-600',
                        }}
                    />
                </div>

                {/* DURATION & TIME SELECTION */}
                <div className="space-y-6">
                    {/* Duration Section - only shows if a date is selected */}
                    {consultationData.date && (
                        <div>
                            <h3 className="font-semibold mb-2">2. Select a Duration</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {durationOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => onUpdateField('duration', option.value)}
                                        className={`
                                        p-3 w-full text-sm rounded-md border transition-colors
                                        ${consultationData.duration === option.value
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                                            }
                                        `}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Time Slot Section - only shows if a date and duration are selected */}
                    {consultationData.date && consultationData.duration && (
                        <div>
                            <h3 className="font-semibold mb-2">3. Select a Time ({format(consultationData.date, 'eeee, MMM d')})</h3>
                            {availableTimes.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {availableTimes.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => onUpdateField('time', time)}
                                            className={`
                                            p-3 w-full text-sm rounded-md border transition-colors
                                            ${consultationData.time === time
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                                                }
                                            `}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-sm text-gray-500 p-4 bg-gray-50 rounded-md">
                                    No available times for this date and duration. Please select a different date or duration.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}