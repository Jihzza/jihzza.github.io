// src/components/scheduling/consultations/ConsultationScheduleStep.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { getAppointmentsForDate } from '../../../services/appointmentService'
import { getAvailableTimeSlots } from '../../../services/availabilityService'
import CustomCalendar from './CustomCalendar'
import ScrollableSelector from './ScrollableSelector'
import AppointmentSummary from './AppointmentSummary'
import { useTranslation } from 'react-i18next'

export default function ConsultationScheduleStep({ consultationData, onUpdateField }) {
  const { user } = useAuth()
  const { t } = useTranslation()

  const [dailyAppointments, setDailyAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { date: selectedDate, duration: selectedDuration, time: selectedTime } = consultationData

  const durationOptions = useMemo(() => t('scheduling.durationOptions', { returnObjects: true }) || [], [t])

  // Fetch appointments when the selected date changes.
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!selectedDate || !user) {
        setDailyAppointments([])
        setError('')
        return
      }
      setIsLoading(true)
      setError('')
      try {
        const { data } = await getAppointmentsForDate(selectedDate)
        if (!cancelled) setDailyAppointments(data || [])
      } catch (e) {
        console.error('Failed to fetch appointments for the selected date:', e)
        if (!cancelled) {
          setDailyAppointments([])
          setError(t('scheduling.errorLoading', { defaultValue: 'Could not load availability. Please try again.' }))
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [selectedDate, user, t])

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !selectedDuration || isLoading) return []
    return getAvailableTimeSlots(selectedDate, Number(selectedDuration), dailyAppointments)
  }, [selectedDate, selectedDuration, dailyAppointments, isLoading])

  const handleDateSelect = useCallback((date) => {
    onUpdateField('date', date)
    onUpdateField('duration', null)
    onUpdateField('time', null)
  }, [onUpdateField])

  const handleDurationSelect = useCallback((duration) => {
    onUpdateField('duration', duration)
    onUpdateField('time', null)
  }, [onUpdateField])

  const handleTimeSelect = useCallback((time) => {
    onUpdateField('time', time)
  }, [onUpdateField])

  return (
    <div className="w-full space-y-8">
      <CustomCalendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        isDateSelectionRestricted={true}
        weekStartsOn={0}
      />

      {selectedDate && (
        <ScrollableSelector
          title={t('scheduling.durationSelectorTitle')}
          options={durationOptions}
          selectedValue={selectedDuration}
          onSelect={handleDurationSelect}
          ariaLabel={t('scheduling.durationSelectorAria', { defaultValue: 'Select duration' })}
        />
      )}

      {isLoading && (
        <p className="text-center text-gray-400 animate-pulse" aria-live="polite">
          {t('scheduling.loadingTimes')}
        </p>
      )}

      {selectedDate && selectedDuration && !isLoading && (
        <ScrollableSelector
          title={t('scheduling.timeSelectorTitle')}
          options={availableTimeSlots}
          selectedValue={selectedTime}
          onSelect={handleTimeSelect}
          emptyStateMessage={t('scheduling.noSlotsAvailable')}
          ariaLabel={t('scheduling.timeSelectorAria', { defaultValue: 'Select time' })}
        />
      )}

      {error && (
        <p className="text-center text-red-300" role="alert">{error}</p>
      )}

      {selectedDate && selectedDuration && selectedTime && (
        <>
          <h3 className="text-base font-semibold text-white mb-3 text-center md:text-xl lg:text-base">
            {t('scheduling.consultationSummaryTitle', { defaultValue: 'Consultation Summary' })}
          </h3>
          <AppointmentSummary
            date={selectedDate}
            startTime={selectedTime}
            duration={selectedDuration}
          />
        </>
      )}
    </div>
  )
}