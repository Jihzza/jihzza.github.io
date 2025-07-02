// src/components/calendar/AppointmentCalendar.jsx
import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

/**
 * A reusable calendar view for displaying and selecting consultation dates
 * This is a dumb component that receives all its data and handlers via props
 * 
 * @param {Date | null} selectedDate - The currently selected date
 * @param {function} onDateSelect - Callback function to handle date selection
 * @param {Date | null} highlightedDates - The minimum selectable date
 */ 
export default function ConsultationCalendar({ selectedDate, onDateSelect, highlightedDates }) {
    const highlightedDaysStyle = {
        border: '2px solid #BFA200',
    };

    const selectedDayStyle = {
        backgroundColor: '#002147',
        color: 'white',
    };

    const footer = selectedDate
        ? `Selected date: ${format(selectedDate, 'PPP')}`
        : 'Click a day to see its appointments';

        return (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={onDateSelect}
                modifiers={{ highlighted: highlightedDates }}
                modifiersStyles={{
                  highlighted: highlightedDaysStyle,
                  selected: selectedDayStyle,
                }}
                footer={<p className="text-center text-sm mt-2 text-gray-600">{footer}</p>}
                // We can reuse the styling from the scheduling page for consistency.
                classNames={{
                  root: 'bg-white',
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
          );
        }