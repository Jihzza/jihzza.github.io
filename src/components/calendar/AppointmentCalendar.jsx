// src/components/calendar/AppointmentCalendar.jsx

import React, { useMemo } from 'react';
import { parseISO } from 'date-fns';
import CustomCalendar from '../scheduling/consultations/CustomCalendar';

/**
 * A specialized calendar for the CalendarPage that highlights dates with scheduled appointments.
 *
 * @param {Array} appointments - The list of all appointment objects.
 * @param {Date | null} selectedDate - The currently selected date.
 * @param {function(Date): void} onDateSelect - Callback to set the selected date.
 */
export default function AppointmentCalendar({ appointments, selectedDate, onDateSelect }) {
    
    const highlightedDates = useMemo(() => {
        return appointments ? appointments.map(app => parseISO(app.appointment_date)) : [];
    }, [appointments]);

    return (
        // --- STYLING CHANGE IS HERE ---
        // This wrapper provides the "card" styling and padding around the calendar.
        <div className="bg-[#002147] p-4 rounded-lg shadow-md w-full max-w-md mx-auto">
            <CustomCalendar
                selectedDate={selectedDate}
                onDateSelect={onDateSelect}
                highlightedDates={highlightedDates}
            />
        </div>
    );
}