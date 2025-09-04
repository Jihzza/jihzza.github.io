// src/components/appointments/AppointmentCard.jsx

import React from 'react'
import PropTypes from 'prop-types'
import { format, parseISO, addMinutes, isValid } from 'date-fns'
import { ClockIcon, TagIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next' // ← added

export default function AppointmentCard({ appointment }) {
  const { t } = useTranslation() // ← added
  if (!appointment) return null

  // --- DATA SAFETY & FORMATTING ---
  const rawStart = appointment?.appointment_start
  const duration = Number.isFinite(appointment?.duration_minutes)
    ? appointment.duration_minutes
    : null

  const parsedStart = rawStart ? parseISO(rawStart) : null
  const startDateTime = parsedStart && isValid(parsedStart) ? parsedStart : null
  const endDateTime = startDateTime && duration != null ? addMinutes(startDateTime, duration) : null

  const formattedDate = startDateTime ? format(startDateTime, 'eeee, MMMM d, yyyy') : t('appointments.card.dateTbd') // ← changed
  const formattedStartTime = startDateTime ? format(startDateTime, 'p') : '—'
  const formattedEndTime = endDateTime ? format(endDateTime, 'p') : '—'

  const serviceType = appointment?.service_type
    ? appointment.service_type.charAt(0).toUpperCase() + appointment.service_type.slice(1)
    : t('appointments.card.appointmentFallback') // ← changed

  // pluralized with i18n
  const durationLabel = duration != null
    ? t('appointments.card.duration', { count: duration }) // ← changed
    : null

  return (
    <article
      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white/90 p-5 shadow-sm transition hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500"
      aria-label={t('appointments.card.ariaLabel', { serviceType, date: formattedDate })} // ← changed
    >
      {/* Subtle accent background & gradient spine */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-[#BFA200]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1000px_300px_at_100%_0%,rgba(99,102,241,0.06),transparent)]"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT: Title + Date */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <TagIcon className="h-5 w-5 shrink-0 text-black md:h-7 md:w-7 lg:w-6 lg:h-6" />
            <h3 className="truncate text-lg font-semibold text-gray-900 md:text-xl lg:text-lg">{serviceType}</h3>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 md:text-base lg:text-sm">
            <CalendarIcon className="h-4 w-4 md:h-5 md:w-5 lg:h-4 lg:w-4" />
            {startDateTime ? (
              <time dateTime={rawStart} title={formattedDate} className="truncate">
                {formattedDate}
              </time>
            ) : (
              <span className="truncate">{formattedDate}</span>
            )}
          </div>
        </div>

        {/* RIGHT: Time Range + Duration */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-sm font-medium text-gray-800 md:text-base lg:text-sm">
            <ClockIcon className="h-4 w-4 md:h-6 md:w-6 lg:h-5 lg:w-5" />
            <span>
              {formattedStartTime} <span aria-hidden>–</span> {formattedEndTime}
            </span>
          </div>
          {durationLabel && (
            <p className="mt-1 text-xs text-gray-500 md:text-sm lg:text-xs">({durationLabel})</p>
          )}
        </div>
      </div>
    </article>
  )
}

AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    appointment_start: PropTypes.string, // ISO date string
    duration_minutes: PropTypes.number,
    service_type: PropTypes.string,
  }),
}
