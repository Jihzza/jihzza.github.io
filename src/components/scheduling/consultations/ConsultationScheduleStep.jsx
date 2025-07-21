// src/components/scheduling/consultations/ConsultationScheduleStep.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
// --- CHANGE: We now need a service that can fetch appointments by date. ---
// This is a crucial backend requirement. We are assuming its existence.
import { getAppointmentsForDate } from '../../../services/appointmentService'; 
import { getAvailableTimeSlots } from '../../../services/availabilityService'; 
import CustomCalendar from './CustomCalendar';
import ScrollableSelector from './ScrollableSelector';
import AppointmentSummary from './AppointmentSummary';
import { useTranslation } from 'react-i18next';

export default function ConsultationScheduleStep({ consultationData, onUpdateField }) {
  const { user } = useAuth();
  const { t } = useTranslation();

  // --- CHANGE: State now manages appointments for the *selected date only*. ---
  const [dailyAppointments, setDailyAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // For better UX
  const { date: selectedDate, duration: selectedDuration, time: selectedTime } = consultationData;

  const durationOptions = useMemo(() => t('scheduling.durationOptions', { returnObjects: true }), [t]);

  // --- REFACTORED LOGIC: Fetch appointments when the selected date changes. ---
  // "Why": This is the heart of the new logic. We trigger a new database fetch
  // ONLY when the user picks a new date. This ensures our data is always relevant
  // and minimizes unnecessary network requests.
  useEffect(() => {
    // Only proceed if a date is actually selected.
    if (selectedDate && user) {
      const fetchAppointmentsForDay = async () => {
        setIsLoading(true);
        try {
          // We call a more specific service function now, passing the selected date.
          const { data } = await getAppointmentsForDate(selectedDate);
          setDailyAppointments(data || []);
        } catch (error) {
          console.error("Failed to fetch appointments for the selected date:", error);
          // Optionally, you can set an error state here to show in the UI.
          setDailyAppointments([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAppointmentsForDay();
    } else {
      // If no date is selected, clear any previous appointment data.
      setDailyAppointments([]);
    }
  }, [selectedDate, user]); // Dependency array ensures this runs when `selectedDate` changes.

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !selectedDuration || isLoading) {
      return [];
    }
    // --- The key connection: We now pass the dynamically fetched `dailyAppointments` ---
    // to our pure business logic function. The front-end orchestrates, the service calculates.
    return getAvailableTimeSlots(selectedDate, Number(selectedDuration), dailyAppointments);
  }, [selectedDate, selectedDuration, dailyAppointments, isLoading]);

  const handleDateSelect = useCallback((date) => {
    onUpdateField('date', date);
    onUpdateField('duration', null);
    onUpdateField('time', null);
  }, [onUpdateField]);
  
  const handleDurationSelect = useCallback((duration) => {
    onUpdateField('duration', duration);
    onUpdateField('time', null);
  }, [onUpdateField]);

  const handleTimeSelect = useCallback((time) => {
    onUpdateField('time', time);
  }, [onUpdateField]);

  return (
    <div className="w-full space-y-8">
      <CustomCalendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        isDateSelectionRestricted={true}
      />

      {selectedDate && (
        <ScrollableSelector
          title={t('scheduling.durationSelectorTitle')}
          options={durationOptions}
          selectedValue={selectedDuration}
          onSelect={handleDurationSelect}
        />
      )}
      
      {/* --- UI FEEDBACK FOR LOADING STATE --- */}
      {isLoading && <p className="text-center text-gray-400 animate-pulse">{t('scheduling.loadingTimes')}</p>}

      {/* This section now intelligently hides if times are loading or if none are available */}
      {selectedDate && selectedDuration && !isLoading && (
        <ScrollableSelector
          title={t('scheduling.timeSelectorTitle')}
          options={availableTimeSlots}
          selectedValue={selectedTime}
          onSelect={handleTimeSelect}
          // --- CHANGE: Add a message for when no slots are available ---
          // "Why": Provides clear feedback to the user, preventing confusion.
          emptyStateMessage={t('scheduling.noSlotsAvailable')}
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