// src/components/scheduling/consultations/ConsultationScheduleStep.jsx

import React, { useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
// We need `addMinutes` to calculate the end time for the summary
import { format, set, isBefore, startOfToday, parse, addMinutes } from 'date-fns';

// UTILITY DATA & FUNCTIONS
const durationOptions = [
    { label: '45min', value: 45 },
    { label: '1h', value: 60 },
    { label: '1h 15min', value: 75 },
    { label: '1h 30min', value: 90 },
    { label: '1h 45min', value: 105 },
    { label: '2h', value: 120 },
];

const generateTimeSlots = (selectedDate, durationInMinutes) => {
    if (!selectedDate || !durationInMinutes) return [];
    const slots = [];
    const now = new Date();
    let slotTime = set(selectedDate, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 });
    const workdayEnd = set(selectedDate, { hours: 22, minutes: 0, seconds: 0, milliseconds: 0 });

    while (true) {
        const finishTime = addMinutes(slotTime, durationInMinutes);
        if (isBefore(workdayEnd, finishTime)) {
            break;
        }
        if (isBefore(now, slotTime)) {
            slots.push(format(slotTime, 'HH:mm'));
        }
        slotTime = addMinutes(slotTime, 15);
    }
    return slots;
};

// COMPONENT DEFINITION
export default function ConsultationScheduleStep({ consultationData, onUpdateField }) {
    const availableTimes = useMemo(() => generateTimeSlots(consultationData.date, consultationData.duration), [consultationData.date, consultationData.duration]);

    // --- NEW: Calculate start and end times for the summary view ---
    const { startTime, endTime } = useMemo(() => {
        if (!consultationData.date || !consultationData.time || !consultationData.duration) {
            return { startTime: null, endTime: null };
        }
        try {
            const start = parse(consultationData.time, 'HH:mm', consultationData.date);
            const end = addMinutes(start, consultationData.duration);
            return {
                startTime: format(start, 'HH:mm'),
                endTime: format(end, 'HH:mm'),
            };
        } catch (error) {
            return { startTime: null, endTime: null };
        }
    }, [consultationData.date, consultationData.time, consultationData.duration]);

    // RENDER LOGIC
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-center text-white mb-2">Schedule your consultation</h2>
            <p className="text-center text-white mb-6">Select a date, duration, and time that works for you.</p>

            {/* --- CHANGE: Main container is now a single-column flex container --- */}
            <div className="flex flex-col space-y-6">

                {/* --- CHANGE: Calendar has been restyled for a dark theme --- */}
                <DayPicker
                    mode="single"
                    selected={consultationData.date}
                    onSelect={(date) => onUpdateField('date', date)}
                    disabled={[{ before: startOfToday() }, { dayOfWeek: [0, 6] }]}
                    classNames={{
                        root: 'text-white bg-transparent p-0',
                        caption: 'flex justify-between items-center mb-4 px-2',
                        caption_label: 'text-base font-medium',
                        nav_button: 'h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10',
                        head_row: 'flex justify-between',
                        head_cell: 'w-10 h-10 text-sm font-semibold text-gray-400',
                        table: 'w-full border-collapse',
                        tbody: 'flex flex-col gap-2',
                        row: 'flex justify-between',
                        cell: 'p-0',
                        day: 'w-10 h-10 rounded-full hover:bg-white/10 transition-colors',
                        day_selected: 'bg-[#BFA200] text-black font-bold hover:bg-yellow-500',
                        day_disabled: 'text-gray-600 cursor-not-allowed',
                        day_today: 'font-bold text-[#BFA200]',
                    }}
                />

                {/* --- CHANGE: Duration section is now a horizontal slider --- */}
                {consultationData.date && (
                    <div>
                        <h3 className="font-semibold mb-2 text-white">Duration</h3>
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {durationOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => onUpdateField('duration', option.value)}
                                    // --- CHANGE: Updated styles to match the design ---
                                    className={`px-4 py-2 text-sm rounded-md border-2 whitespace-nowrap transition-colors ${
                                        consultationData.duration === option.value
                                            ? 'bg-[#BFA200] text-black border-[#BFA200]'
                                            : 'bg-transparent text-white border-gray-600 hover:bg-white/10'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- CHANGE: Time section is now a horizontal slider --- */}
                {consultationData.date && consultationData.duration && (
                    <div>
                        <h3 className="font-semibold mb-2 text-white">Time</h3>
                        {availableTimes.length > 0 ? (
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {availableTimes.map((time) => (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => onUpdateField('time', time)}
                                        // --- CHANGE: Updated styles to match the design ---
                                        className={`px-4 py-2 text-sm rounded-md border-2 whitespace-nowrap transition-colors ${
                                            consultationData.time === time
                                                ? 'bg-[#BFA200] text-black border-[#BFA200]'
                                                : 'bg-transparent text-white border-gray-600 hover:bg-white/10'
                                        }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-sm text-gray-400 p-4 bg-black/20 rounded-md">
                                No available times. Please select a different date or duration.
                            </div>
                        )}
                    </div>
                )}

                {/* --- NEW: Summary Section --- */}
                {startTime && endTime && consultationData.date && (
                     <div className="pt-4 text-center">
                        <p className="text-lg font-semibold text-white">{format(consultationData.date, 'eeee, MMM d')}</p>
                        <div className="flex justify-center items-center gap-8 mt-2 text-white">
                            <div>
                                <p className="text-sm text-gray-400">from</p>
                                <p className="text-xl font-bold">{startTime}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">to</p>
                                <p className="text-xl font-bold">{endTime}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}