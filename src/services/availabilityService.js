// src/services/availabilityService.js

import {
    parseISO,
    startOfDay,
    endOfDay,
    set,
    addMinutes,
    subMinutes,
    isWithinInterval,
    areIntervalsOverlapping,
} from 'date-fns';

/**
 * @typedef {Object} TimeSlot
 * @property {string} value - The time in "HH:mm" format (e.g., "10:15").
 * @property {string} label - The display label for the time (e.g., "10:15 AM").
 */

/**
 * @typedef {Object} Booking
 * @property {string} appointment_date - The ISO 8601 string for the appointment's start time.
 * @property {number} duration_minutes - The duration of the appointment in minutes.
 */

/**
 * Defines the operational parameters for scheduling.
 * - WORKING_HOURS: Consultations can only happen between 10:00 AM and 10:00 PM.
 * - TIME_SLOT_INTERVAL: We check for availability in 15-minute increments.
 * - BUFFER_MINUTES: A mandatory 30-minute break is required before each booking.
 */
const SCHEDULING_CONFIG = {
    WORKING_HOURS: { start: { hours: 10, minutes: 0 }, end: { hours: 22, minutes: 0 } },
    TIME_SLOT_INTERVAL: 15,
    BUFFER_MINUTES: 30,
};

/**
 * Creates a list of all time intervals that are blocked by existing bookings,
 * including the mandatory pre-booking buffer.
 *
 * @param {Date} date - The date for which to get blocked times.
 * @param {Booking[]} existingBookings - An array of existing appointment objects.
 * @returns {Interval[]} An array of date-fns Interval objects representing blocked times.
 */
const getBlockedTimeIntervals = (date, existingBookings) => {
    if (!existingBookings) return [];

    return existingBookings.map(booking => {
        const startTime = parseISO(booking.appointment_date);
        
        // The actual booked interval.
        const bookingEnd = addMinutes(startTime, booking.duration_minutes);
        
        // The buffer interval starts 30 minutes *before* the booking.
        const bufferStart = subMinutes(startTime, SCHEDULING_CONFIG.BUFFER_MINUTES);

        // The full blocked interval includes the buffer and the appointment itself.
        // We return a single interval from the start of the buffer to the end of the appointment.
        return { start: bufferStart, end: bookingEnd };
    });
};

/**
 * The core "Tetris" logic. It generates and filters time slots to find all valid,
 * available start times for a new consultation.
 *
 * @param {Date} selectedDate - The calendar date the user has picked.
 * @param {number} desiredDuration - The duration in minutes for the new consultation.
 * @param {Booking[]} existingBookings - An array of appointments already on the calendar for that day.
 * @returns {TimeSlot[]} An array of available time slot objects.
 */
export const getAvailableTimeSlots = (selectedDate, desiredDuration, existingBookings) => {
    // 1. Determine the absolute start and end of the working day.
    const dayStart = set(startOfDay(selectedDate), SCHEDULING_CONFIG.WORKING_HOURS.start);
    const dayEnd = set(endOfDay(selectedDate), SCHEDULING_CONFIG.WORKING_HOURS.end);

    // 2. Get all the intervals that are already blocked by existing appointments and their buffers.
    const blockedIntervals = getBlockedTimeIntervals(selectedDate, existingBookings);

    const availableSlots = [];
    let currentTime = dayStart;

    // 3. Iterate through the day in 15-minute increments.
    while (currentTime < dayEnd) {
        // 4. For each potential start time, define the proposed new appointment interval.
        const proposedEndTime = addMinutes(currentTime, desiredDuration);
        const proposedInterval = { start: currentTime, end: proposedEndTime };

        // 5. A slot is valid ONLY IF it meets all of the following criteria:
        const isValid =
            // a) The proposed end time does not exceed the end of the working day.
            isWithinInterval(proposedEndTime, { start: dayStart, end: dayEnd }) &&
            
            // b) The proposed interval does NOT overlap with any of the blocked intervals.
            !blockedIntervals.some(blocked =>
                areIntervalsOverlapping(proposedInterval, blocked, { inclusive: false })
            );

        // 6. If the slot is valid, add it to our list of results.
        if (isValid) {
            availableSlots.push({
                value: `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`,
                label: `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`,
            });
        }

        // 7. Move to the next potential slot and repeat the process.
        currentTime = addMinutes(currentTime, SCHEDULING_CONFIG.TIME_SLOT_INTERVAL);
    }

    return availableSlots;
};