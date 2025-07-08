// src/components/scheduling/consultations/ConsultationScheduleStep.jsx

import React, { useState } from 'react';
import CustomCalendar from './CustomCalendar';
import ScrollableSelector from './ScrollableSelector';
// 1. Import our new summary component.
import AppointmentSummary from './AppointmentSummary';

// --- (Data definitions for durationOptions and timeSlots remain the same) ---
const durationOptions = [
    { value: '45', label: '45 min' }, { value: '60', label: '1h' },
    { value: '75', label: '1h 15min' }, { value: '90', label: '1h 30min' },
    { value: '105', label: '1h 45min' }, { value: '120', label: '2h' },
];
const timeSlots = Array.from({ length: (22 - 10) * 4 + 1 }, (_, i) => {
    const totalMinutes = 10 * 60 + i * 15;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return { value: time, label: time };
});

export default function ConsultationScheduleStep() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedDuration(null);
    setSelectedTime(null);
  };
  
  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  return (
    <div className="w-full space-y-8">
      
      <CustomCalendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />

      {selectedDate && (
        <ScrollableSelector
          title="Select Duration"
          options={durationOptions}
          selectedValue={selectedDuration}
          onSelect={handleDurationSelect}
        />
      )}

      {selectedDate && selectedDuration && (
        <ScrollableSelector
          title="Select Time"
          options={timeSlots}
          selectedValue={selectedTime}
          onSelect={handleTimeSelect}
        />
      )}

      {/* 2. Conditionally render the summary component. */}
      {/* This component will only appear when all three selections have been made,
          providing the user with final confirmation of their choices. */}
      {selectedDate && selectedDuration && selectedTime && (
        <AppointmentSummary
          date={selectedDate}
          startTime={selectedTime}
          duration={selectedDuration}
        />
      )}
    </div>
  );
}