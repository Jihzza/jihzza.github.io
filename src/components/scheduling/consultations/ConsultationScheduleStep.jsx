// src/components/scheduling/consultations/ConsultationScheduleStep.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getAppointmentsByUserId } from '../../../services/appointmentService'; 
import { getAvailableTimeSlots } from '../../../services/availabilityService'; 
import CustomCalendar from './CustomCalendar';
import ScrollableSelector from './ScrollableSelector';
import AppointmentSummary from './AppointmentSummary';

const durationOptions = [
    { value: '45', label: '45 min' }, { value: '60', label: '1h' },
    { value: '75', label: '1h 15min' }, { value: '90', label: '1h 30min' },
    { value: '105', label: '1h 45min' }, { value: '120', label: '2h' },
];

export default function ConsultationScheduleStep({ consultationData, onUpdateField }) {
  const { user } = useAuth();
  
  // State to hold existing appointments for the selected month
  const [existingAppointments, setExistingAppointments] = useState([]);
  
  // Destructure props for easier access
  const { date: selectedDate, duration: selectedDuration, time: selectedTime } = consultationData;

  // --- DATA FETCHING ---
  // When the component mounts or the user changes, fetch all their appointments.
  // We fetch all appointments at once to avoid re-fetching every time a date is clicked.
  useEffect(() => {
    if (user) {
      const fetchAppointments = async () => {
        const { data } = await getAppointmentsByUserId(user.id);
        setExistingAppointments(data || []);
      };
      fetchAppointments();
    }
  }, [user]);

  // --- DERIVED STATE / MEMOIZATION ---
  // This is the "Tetris" logic in action.
  // `useMemo` ensures this complex calculation only re-runs when its dependencies change.
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !selectedDuration) {
      return [];
    }
    // Call our new service to get the list of valid time slots.
    return getAvailableTimeSlots(selectedDate, Number(selectedDuration), existingAppointments);
  }, [selectedDate, selectedDuration, existingAppointments]);


  // --- EVENT HANDLERS ---
  // These handlers now just call the `onUpdateField` prop passed from SchedulingPage.
  // This keeps the state management centralized in the parent.
  const handleDateSelect = (date) => {
    onUpdateField('date', date);
    onUpdateField('duration', null);
    onUpdateField('time', null);
  };
  
  const handleDurationSelect = (duration) => {
    onUpdateField('duration', duration);
    onUpdateField('time', null);
  };

  const handleTimeSelect = (time) => {
    onUpdateField('time', time);
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
      
      {/* The time selector now uses the dynamically generated `availableTimeSlots` */}
      {selectedDate && selectedDuration && (
        <ScrollableSelector
          title="Select Available Time"
          options={availableTimeSlots}
          selectedValue={selectedTime}
          onSelect={handleTimeSelect}
        />
      )}

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