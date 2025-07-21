// src/components/appointments/AppointmentCard.jsx

import React from 'react';
import { format, parseISO, addMinutes } from 'date-fns';
import { ClockIcon, TagIcon, CalendarIcon } from '@heroicons/react/24/outline';

/**
 * A reusable card component to display the summary of a single appointment.
 * This is a presentational component that receives all its data via props.
 *
 * @param {object} appointment - The appointment data object from Supabase.
 */
export default function AppointmentCard({ appointment }) {
    if (!appointment) return null;

    // --- DATA FORMATTING ---
    // The "Why": We parse the ISO string from the database into a Date object
    // that date-fns can work with. This is a critical step for reliability.
    const startDateTime = parseISO(appointment.appointment_start);
    const endDateTime = addMinutes(startDateTime, appointment.duration_minutes);

    const formattedDate = format(startDateTime, 'eeee, MMMM d, yyyy');
    const formattedStartTime = format(startDateTime, 'p'); // e.g., "10:00 AM"
    const formattedEndTime = format(endDateTime, 'p');     // e.g., "11:00 AM"

    // Capitalize the service type for display
    const serviceType = appointment.service_type
        ? appointment.service_type.charAt(0).toUpperCase() + appointment.service_type.slice(1)
        : 'Appointment';

    // --- RENDER LOGIC ---
    return (
        // The main card container. It's a simple, styled div.
        // It should NOT use ProfileSectionLayout.
        <div className="bg-white shadow-md rounded-lg p-5 border border-gray-200 text-gray-800">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <TagIcon className="h-5 w-5 mr-2 text-indigo-500" />
                        {serviceType}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                        <CalendarIcon className="h-4 w-4 mr-1.5" />
                        {formattedDate}
                    </div>
                </div>
                <div className="text-right">
                     <div className="flex items-center text-sm font-semibold text-gray-700">
                        <ClockIcon className="h-4 w-4 mr-1.5" />
                        <span>{`${formattedStartTime} - ${formattedEndTime}`}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{`(${appointment.duration_minutes} minutes)`}</p>
                </div>
            </div>
        </div>
    );
}