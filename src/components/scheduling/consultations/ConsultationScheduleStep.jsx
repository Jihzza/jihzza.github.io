// src/components/scheduling/consultations/ConsultationScheduleStep.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getAppointmentsByUserId } from '../../../services/appointmentService'; 
import { getAvailableTimeSlots } from '../../../services/availabilityService'; 
import CustomCalendar from './CustomCalendar';
import ScrollableSelector from './ScrollableSelector';
import AppointmentSummary from './AppointmentSummary';
import { useTranslation } from 'react-i18next'; // 1. Import the hook

// 2. Remove the hardcoded durationOptions array from here.

export default function ConsultationScheduleStep({ consultationData, onUpdateField }) {
  const { user } = useAuth();
  const { t } = useTranslation(); // 3. Initialize the translation function

  const [existingAppointments, setExistingAppointments] = useState([]);
  const { date: selectedDate, duration: selectedDuration, time: selectedTime } = consultationData;

  // 4. Get duration options directly from your translation file
  const durationOptions = useMemo(() => t('scheduling.durationOptions', { returnObjects: true }), [t]);

  useEffect(() => {
    if (user) {
      const fetchAppointments = async () => {
        const { data } = await getAppointmentsByUserId(user.id);
        setExistingAppointments(data || []);
      };
      fetchAppointments();
    }
  }, [user]);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !selectedDuration) {
      return [];
    }
    return getAvailableTimeSlots(selectedDate, Number(selectedDuration), existingAppointments);
  }, [selectedDate, selectedDuration, existingAppointments]);

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
          // 5. Use the translated title
          title={t('scheduling.durationSelectorTitle')}
          options={durationOptions}
          selectedValue={selectedDuration}
          onSelect={handleDurationSelect}
        />
      )}
      
      {selectedDate && selectedDuration && (
        <ScrollableSelector
          // 6. Use the translated title
          title={t('scheduling.timeSelectorTitle')}
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