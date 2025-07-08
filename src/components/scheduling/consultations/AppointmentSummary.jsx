// src/components/scheduling/consultations/AppointmentSummary.jsx
import React from 'react';
import { format, addMinutes } from 'date-fns';

/**
 * A component to display a summary of the selected appointment details.
 * It calculates the end time based on the start time and duration.
 *
 * @param {Date} date - The selected date object.
 * @param {string} startTime - The selected start time in "HH:mm" format.
 * @param {string} duration - The selected duration in minutes.
 */
export default function AppointmentSummary({ date, startTime, duration }) {
  // --- DERIVED DATA CALCULATION ---
  // We perform the logic to calculate the end time right here.

  // 1. Create a full Date object for the start of the appointment.
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const startDateTime = new Date(date);
  // Set the hours and minutes from the time selector onto the selected date.
  startDateTime.setHours(startHours, startMinutes, 0, 0); 

  // 2. Calculate the end time by adding the duration (in minutes).
  const endDateTime = addMinutes(startDateTime, Number(duration));

  // 3. Format the date and times for a clean display.
  const formattedDate = format(date, 'E, d MMM yyyy'); // e.g., "Tue, 8 Jul 2025"
  const formattedEndTime = format(endDateTime, 'HH:mm'); // e.g., "11:00"

  return (
    <div className="w-full max-w-md mx-auto rounded-lg text-white animate-fade-in">
      <div className="text-center font-semibold text-lg mb-3 border-b border-gray-600 pb-2">
        {formattedDate}
      </div>
      <div className="flex justify-evenly items-center text-lg">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-400">from</span>
          <span className="font-bold">{startTime}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-400">to</span>
          <span className="font-bold">{formattedEndTime}</span>
        </div>
      </div>
    </div>
  );
}