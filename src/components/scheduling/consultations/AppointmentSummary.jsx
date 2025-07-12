// src/components/scheduling/consultations/AppointmentSummary.jsx
import React from 'react';
import { format, addMinutes } from 'date-fns';
import { useTranslation } from 'react-i18next'; // 1. Import the hook

/**
 * A component to display a summary of the selected appointment details.
 * It calculates the end time based on the start time and duration.
 *
 * @param {Date} date - The selected date object.
 * @param {string} startTime - The selected start time in "HH:mm" format.
 * @param {string} duration - The selected duration in minutes.
 */
export default function AppointmentSummary({ date, startTime, duration }) {
  const { t } = useTranslation(); // 2. Initialize the translation function

  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const startDateTime = new Date(date);
  startDateTime.setHours(startHours, startMinutes, 0, 0); 

  const endDateTime = addMinutes(startDateTime, Number(duration));

  const formattedDate = format(date, 'E, d MMM yyyy');
  const formattedEndTime = format(endDateTime, 'HH:mm');

  return (
    <div className="w-full max-w-md mx-auto rounded-lg text-white animate-fade-in">
      <div className="text-center font-semibold text-lg mb-3 border-b border-gray-600 pb-2">
        {formattedDate}
      </div>
      <div className="flex justify-evenly items-center text-lg">
        <div className="flex flex-col items-center">
          {/* 3. Use the translated label */}
          <span className="text-sm text-gray-400">{t('scheduling.appointmentSummary.from')}</span>
          <span className="font-bold">{startTime}</span>
        </div>
        <div className="flex flex-col items-center">
          {/* 4. Use the translated label */}
          <span className="text-sm text-gray-400">{t('scheduling.appointmentSummary.to')}</span>
          <span className="font-bold">{formattedEndTime}</span>
        </div>
      </div>
    </div>
  );
}